/* eslint-disable max-lines */
/* eslint-disable complexity */
import { Interactions } from 'aws-amplify'
import { CONFIG } from '../config/config'
import {
  lexPostCall,
  setLanguage,
  setActionType,
  pushMessages,
  setEndChat,
  setliveChat,
  setSessionData,
  setIsLoading,
  setIsAgentTyping,
  disableInputField,
} from '../ducks/lexClient'
import {
  ACTION_TYPE,
  BOT_TYPE,
  LIVECHAT_STATUS,
  END_CHAT_MESSAGES,
  TOPIC,
  LEXTHREAD_PROPS,
  SEARCH_QUERY,
} from '../helper/enum'
import { Util } from '../helper/Util'
import {
  AgentLiveService,
  ConstructPayload,
} from './base-service.js/agentLiveService'
import { axiosWithRetry } from './base-service.js/axios-wrapper'
import { convertLinks } from '../helper/Util'

const service = new AgentLiveService()

export const leXTextCall =
  (searchTerm, initialRender = false) =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true))
      const { lexThread } = getState().lexClient
      const response = await Interactions.send(
        process.env.REACT_APP_MILES_BOT,
        searchTerm
      )
      dispatch(setIsLoading(false))
      processResponse(response)
      let qnabotcontext = response?.sessionAttributes?.qnabotcontext
      const language = qnabotcontext
        ? JSON.parse(qnabotcontext).userLocale
        : 'en'
      const buttons = response?.sessionAttributes?.appContext
        ? JSON.parse(response.sessionAttributes.appContext)
        : null
      const newThread = [
        ...lexThread,
        {
          message: initialRender ? '' : response.message,
          buttons: buttons?.responseCard?.genericAttachments[0]?.buttons
            ? buttons?.responseCard?.genericAttachments[0]?.buttons
            : [],
          type: 'bot',
          language,
          topic: response?.sessionAttributes?.topic,
          isAgentAvailable:
            response?.sessionAttributes.agents_available === 'true',
          sessionAttributes: response?.sessionAttributes,
          date: new Date(),
        },
      ]

      dispatch(lexPostCall(newThread))
      language && dispatch(setLanguage(language))
    } catch (err) {
      dispatch(setIsLoading(false))
      console.log(err)
    }
  }

const processResponse = data => {
  if(data.sessionAttributes.topic === TOPIC.STARTING){
    localStorage.setItem('topic', data.sessionAttributes.topic)
  }
  if (data.sessionAttributes.topic === TOPIC.ENTERING_TOPIC) {
    const agent_available = data.sessionAttributes.agents_available
    const buttonsArray = data.responseCard.genericAttachments[0].buttons

    const newButtonsArray = [...buttonsArray.slice(0, 2)]
    newButtonsArray[0].value = 'QID::20.livechat.firstname'
    newButtonsArray[1].value = SEARCH_QUERY.WELCOME

    if (newButtonsArray.length >= 4 && agent_available !== 'true') {
      newButtonsArray.push(buttonsArray.slice(2, 5))
      newButtonsArray[2].value = ''
      newButtonsArray[3].value = ''
    }
    data.responseCard.genericAttachments[0].buttons = newButtonsArray
  }
}

export const changeLanguage = language => async dispatch => {
  if (language) {
    dispatch(leXTextCall(language.label)) // arabic
    dispatch(setActionType(ACTION_TYPE.DEFAULT))
  }
}

export const searchQuery =
  (query, displayText = '') =>
  async (dispatch, getState) => {
    const { lexThread, language, liveChat, sessionData, agentAvailable } =
      getState().lexClient
    const value = {
      type: 'human',
      message: displayText || query,
      language,
      date: new Date(),
    }
    const newThread = [...lexThread, value]
    const topic =
      lexThread[lexThread.length - 1].topic === 'liveChatStatus.enteringTopic'
    if (agentAvailable && topic) {
      dispatch(updateLexThread(query, BOT_TYPE.HUMAN))
    } else if (
      liveChat.status === LIVECHAT_STATUS.ESTABLISHED ||
      liveChat.status === LIVECHAT_STATUS.CONNECTING
    ) {
      const data = await service.sendMessage(language, sessionData, query)
      data.status === 200 ? dispatch(pushMessages(newThread)) : null
    } else {
      dispatch(lexPostCall(newThread))
      dispatch(leXTextCall(query))
    }
  }

export const botButtonAction = buttonItem => (dispatch, getState) => {
  const { lexThread, agentAvailable } = getState().lexClient
  const checkTopicEntered =
    Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread) ===
    TOPIC.ENTERING_TOPIC
  if (agentAvailable && checkTopicEntered) {
    dispatch(updateLexThread(buttonItem.text, BOT_TYPE.HUMAN))
    dispatch(createCase(buttonItem.text))
    dispatch(disableInputField(false))

    return
  }
  const displayText = agentAvailable ? buttonItem.text : buttonItem.text
  dispatch(searchQuery(buttonItem.value, displayText))
}

export const translator = async (targetLanguage, message) => {
  const config = {
    method: 'post',
    url: `${CONFIG.LIVE_AGENT.ENDPOINT}/translate`,
    data: { targetLanguage, message },
  }

  return axiosWithRetry(config)
}

export const updateLexThread =
  (message, type = BOT_TYPE.BOT) =>
  async (dispatch, getState) => {
    const { lexThread } = getState().lexClient
    const newThread = [...lexThread, { message, type }]

    dispatch(pushMessages(newThread))
  }

let chatRequest = ''

const getMessage = (service, payload) => async (dispatch, getState) => {
  const { liveChat, chatEnded, isAgentTyping } = getState().lexClient
  const { isChatEnded } = chatEnded
  const checkStatus =
    liveChat.status === LIVECHAT_STATUS.CONNECTING ||
    liveChat.status === LIVECHAT_STATUS.ESTABLISHED
  try {
    const response = await service.getMessage(payload)
    const joinedMsg =
      (checkStatus &&
        (await translator(payload.targetLanguage, CONFIG.LIVE_AGENT.HAS_JOINED)
          ?.data?.translation)) ||
      CONFIG.LIVE_AGENT.HAS_JOINED

    const chatRequestSuccess = async () => {
      const responseConnectionEstablished = await translator(
        payload.targetLanguage,
        CONFIG.LIVE_AGENT.LIVE_CHAT_CONNECTION
      )
      dispatch(updateLexThread(responseConnectionEstablished.data?.translation))
    }

    const ChatEstablished = async element => {
      dispatch(
        setliveChat({ ...liveChat, status: LIVECHAT_STATUS.ESTABLISHED })
      )
      dispatch(updateLexThread(`${element.message.name} ${joinedMsg}`))
    }

    const chatMessage = data => {
      const cookedText = convertLinks(data.message.text)
      dispatch(updateLexThread(cookedText, BOT_TYPE.AGENT))
    }

    const chatRequestFail = element => {
      chatRequest = element
      dispatch(updateLexThread('Unable to connect with an agent.'))
    }

    const messages = response.data.messages
    dispatch(setIsLoading(false))
    isAgentTyping &&
      messages.indexOf('AgentTyping') !== -1 &&
      dispatch(setIsAgentTyping(false))

    messages.forEach(async element => {
      console.log('--------GET_MESSAGE--------', element)
      switch (element.type) {
        case 'ChatRequestSuccess':
          await chatRequestSuccess()
          break
        case 'ChatEstablished':
          ChatEstablished(element)
          break
        case 'ChatMessage':
          chatMessage(element)
          break
        // case 'CustomEvent':
        //   // customEvent(element);
        //   break;
        // case 'QueueUpdate':
        //   // queueUpdate(element);
        //   break;
        case 'AgentTyping':
          dispatch(setIsAgentTyping(true))
          break
        case 'AgentNotTyping':
          dispatch(setIsAgentTyping(false))
          break
        case 'ChatEnded':
          dispatch(
            setEndChat({
              isChatEnded: true,
              message: 'Agent has ended the session',
            })
          )
          break
        case 'ChatRequestFail':
          chatRequestFail(element?.type)
          break
        default:
          console.error(`Unknown message type:${element.type}`)
      }
    })
  } catch (error) {
    console.log('GetMessage_Error', error)
  } finally {
    // await sleep(CONFIG.LIVE_AGENT.SALESFORCE_POLLING_INTERVAL);
    if (checkStatus && !isChatEnded && !chatRequest) {
      setTimeout(
        () => dispatch(getMessage(service, payload)),
        CONFIG.LIVE_AGENT.SALESFORCE_POLLING_INTERVAL
      )
    }
  }
}

export const createCase = actionType => async (dispatch, getState) => {
  try {
    const { language, lexThread, userDetails } = getState().lexClient
    const recentThread = lexThread.length && lexThread[lexThread.length - 2]
    const casePayload = Util.getCreateCasePayload(
      userDetails,
      recentThread,
      language,
      actionType
    )
    const userDetail = `${userDetails['liveChat.firstname']} ${userDetails['liveChat.lastname']} - ${casePayload.email}`
    dispatch(setIsLoading(true))
    const result = await service.createCase(casePayload)

    if (result?.status === 200) {
      dispatch(
        setliveChat({ ...casePayload, status: LIVECHAT_STATUS.CREATING_CASE })
      )
      const caseData = Util.parseCreateCaseResponse(result.data)

      const initLiveAgentSession = async () => {
        dispatch(
          setliveChat({ ...casePayload, status: LIVECHAT_STATUS.CONNECTING })
        )
        const session = await service.startSession()

        if (session.status === 200) {
          const livechatConnectionTranslate = await translator(
            language,
            CONFIG.LIVE_AGENT.LIVE_CHAT_CONNECTION
          )

          if (livechatConnectionTranslate.status === 200) {
            const connectResponse = await service.connect(
              session?.data,
              lexThread,
              caseData.caseId,
              caseData.contact.Id,
              userDetail
            )

            if (connectResponse.status === 200) {
              const payload = {
                session: ConstructPayload.sessionPayload(session?.data),
                targetLanguage: language,
              }
              dispatch(setIsLoading(false))
              dispatch(setSessionData(payload))
              await dispatch(getMessage(service, payload))
            }
          }
        }
      }

      const waitingForAgent = Util.stringFormat(
        CONFIG.LIVE_AGENT.WAIT_NEXT_AVAILABLE_AGENT,
        caseData.caseNumber
      )
      const waitingForAgentResponse = await service.translator(
        language,
        waitingForAgent
      )

      if (waitingForAgentResponse?.status === 200) {
        dispatch(
          updateLexThread(
            waitingForAgentResponse.data?.translation || waitingForAgent
          )
        )
        const thanksForWaitingResponse = await service.translator(
          language,
          CONFIG.LIVE_AGENT.WAITING_FOR_AGENT_MESSAGE
        )

        if (thanksForWaitingResponse.status === 200) {
          initLiveAgentSession()
        }
      }
    } else {
      dispatch(setIsLoading(false))
      dispatch(setliveChat(null))
    }
  } catch (error) {
    console.log(error)
    dispatch(setIsLoading(false))
    // eslint-disable-next-line max-lines
  }
}

export const endChat = () => async (dispatch, getState) => {
  const { sessionData } = getState().lexClient
  if (Object.keys(sessionData).length) {
    const result = await service.endChat(sessionData)
    result.status === 200 &&
      dispatch(
        setEndChat({
          isChatEnded: true,
          message: END_CHAT_MESSAGES.AFTER_CONNECTION,
        })
      )
  } else {
    dispatch(
      setEndChat({ isChatEnded: true, message: END_CHAT_MESSAGES.END_CHAT })
    )
  }
}
