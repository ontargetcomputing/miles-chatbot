import { Interactions } from 'aws-amplify'
import { CONFIG } from '../config/config'
import {
  lexPostCall,
  setLanguage,
  setActionType,
  resetIdleTimer,
  pushMessages,
  agentAvailable,
  setEndChat,
  setliveChat,
} from '../ducks/lexClient'
import { ACTION_TYPE, BOT_INQUIRY_OPTIONS, BOT_TYPE, LIVECHAT_STATUS } from '../helper/enum'
import { Util } from '../helper/Util'
import { AgentLiveService, ConstructPayload } from './base-service.js/agentLiveService'
import { axiosWithRetry } from './base-service.js/axios-wrapper'

export const leXTextCall =
  (searchTerm, initialRender = false) =>
    async (dispatch, getState) => {
      try {
        dispatch(resetIdleTimer())
        const { lexThread } = getState().lexClient
        const response = await Interactions.send(
          process.env.REACT_APP_MILES_BOT,
          searchTerm
        )

        processResponse(response)
        let qnabotcontext = response?.sessionAttributes?.qnabotcontext
        const language = qnabotcontext
          ? JSON.parse(qnabotcontext).userLocale
          : 'en'
        const newThread = [
          ...lexThread,
          {
            message: initialRender ? '' : response.message,
            buttons: response?.responseCard?.genericAttachments[0]?.buttons
              ? response?.responseCard?.genericAttachments[0]?.buttons
              : [],
            type: 'bot',
            language,
            topic: response?.sessionAttributes?.topic,
            isAgentAvailable:
              response?.sessionAttributes.agents_available === 'true',
            sessionAttributes: response?.sessionAttributes,
          },
        ]

        dispatch(lexPostCall(newThread))
        language && dispatch(setLanguage(language))
      } catch (err) {
        console.log(err)
      }
    }

const processResponse = data => {
  if (data.sessionAttributes.topic === 'liveChatStatus.starting') {
    const agent_available = data.sessionAttributes.agents_available
    const buttonsArray = data.responseCard.genericAttachments[0].buttons

    const newButtonsArray = [...buttonsArray.slice(0, 2)]
    newButtonsArray[0].value = 'QID::20.livechat.firstname'
    newButtonsArray[1].value = 'QID::Welcome'

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
    (dispatch, getState) => {
      const { lexThread, language } = getState().lexClient
      const value = {
        type: 'human',
        message: displayText || query,
        language
      }
      const newThread = [...lexThread, value]
      dispatch(lexPostCall(newThread))
      dispatch(leXTextCall(query))
    }

export const botButtonAction = buttonItem => (dispatch, getState) => {
  const { lexThread } = getState().lexClient
  const recentThread = lexThread.length && lexThread[lexThread.length - 1]
  const isAgentAvailable = recentThread?.isAgentAvailable
  dispatch(agentAvailable(isAgentAvailable))

  if (
    isAgentAvailable &&
    buttonItem.text === BOT_INQUIRY_OPTIONS.DRIVER_LICENSE
  ) {
    dispatch(createCase(buttonItem.text))

    return
  }
  const displayText = isAgentAvailable && buttonItem.text
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
  (message, type=BOT_TYPE.BOT) => async (dispatch, getState) => {
    const { lexThread } = getState().lexClient
    const newThread = [...lexThread, { message, type}]

    dispatch(pushMessages(newThread))
  }

const getMessage = (service, payload) => async (dispatch, getState) => {
  const { liveChat } = getState().lexClient;
  let liveChatStatus = liveChat?.status;
  try {
    const response = await service.getMessage(payload);
    const joinedMsg = await translator(payload.targetLanguage, CONFIG.LIVE_AGENT.HAS_JOINED)?.data?.translation || CONFIG.LIVE_AGENT.HAS_JOINED;

    const chatRequestSuccess = async () => {
      // context.dispatch('pushLiveChatMessage', {
      //   type: 'bot',
      //   text: establishedMsg,
      // }); 
      liveChatStatus = LIVECHAT_STATUS.ESTABLISHED;
      const responseConnectionEstablished = await translator(payload.targetLanguage, CONFIG.LIVE_AGENT.LIVE_CHAT_CONNECTION)
      dispatch(updateLexThread(responseConnectionEstablished.data?.translation));
      dispatch(setliveChat({ ...liveChat, status: liveChatStatus }));
    }

    const chatMessage = (data) => {
      const cookedText = Util.convertLinks(data.message.text)
      // const newLexThread = {
      //   type: data.type,
      //   message: cookedText,
      //   alts: {
      //     markdown: cookedText,
      //   },
      // }
      dispatch(updateLexThread(cookedText, BOT_TYPE.AGENT));
    }

    response.data.messages.forEach(async (element) => {
      console.log("--------GET_MESSAGE--------", element);
      switch (element.type) {
        case 'ChatRequestSuccess':
          await chatRequestSuccess();
          break;
        case 'ChatEstablished':
          dispatch(updateLexThread(`${element.message.name} ${joinedMsg}`))
          break;
        case 'ChatMessage':
          chatMessage(element);
          break;
        // case 'CustomEvent':
        //   // customEvent(element);
        //   break;
        // case 'QueueUpdate':
        //   // queueUpdate(element);
        //   break;
        // case 'AgentTyping':
        //   agentTyping(element);
        //   break;
        // case 'AgentNotTyping':
        //   agentNotTyping(element);
        //   break;
        case 'ChatEnded':
          dispatch(setEndChat({ isChatEnded: true, message: "You've ended the Chat." }))
          break;
       case 'ChatRequestFail':
        dispatch(updateLexThread('Unable to connect with an agent.'))
        //  dispatch(setliveChat({ status: LIVECHAT_STATUS.DISCONNECTED }));
          break;
        // default:
        //   console.error(`Unknown message type:${type}`)
      }
    });

  } catch (error) {
    console.log("GetMessage_Error", error);
  } finally {
    // await sleep(CONFIG.LIVE_AGENT.SALESFORCE_POLLING_INTERVAL);
    if (liveChat.status === LIVECHAT_STATUS.CONNECTING ||
      liveChat.status === LIVECHAT_STATUS.ESTABLISHED) {
      setTimeout(() => dispatch(getMessage(service, payload)), CONFIG.LIVE_AGENT.SALESFORCE_POLLING_INTERVAL);
    }
  }
}

export const createCase = actionType => async (dispatch, getState) => {
  const { language, lexThread } = getState().lexClient
  const recentThread = lexThread.length && lexThread[lexThread.length - 1]
  const service = new AgentLiveService()
  const casePayload = Util.getCreateCasePayload(
    recentThread,
    language,
    actionType
  )
  const result = await service.createCase(casePayload)

  if (result?.status === 200) {
    dispatch(setliveChat({ ...casePayload, status: LIVECHAT_STATUS.CREATING_CASE }));
    const caseData = Util.parseCreateCaseResponse(result.data)

    const initLiveAgentSession = async () => {
      dispatch(setliveChat({ ...casePayload, status: LIVECHAT_STATUS.CONNECTING }));
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
            casePayload.email
          )

          if (connectResponse.status === 200) {
            const payload = {
              session: ConstructPayload.sessionPayload(session?.data),
              targetLanguage: language

            }
            await dispatch(getMessage(service, payload));
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
      dispatch(updateLexThread( waitingForAgentResponse.data?.translation || waitingForAgent))
        const thanksForWaitingResponse = await service.translator(
        language,
        CONFIG.LIVE_AGENT.WAITING_FOR_AGENT_MESSAGE
      )

      if (thanksForWaitingResponse.status === 200) {
        initLiveAgentSession()
      }
    }
  } else {
    dispatch(setliveChat(null));
  }
}
