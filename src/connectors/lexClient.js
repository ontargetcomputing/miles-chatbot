import { Interactions } from 'aws-amplify'
import { CONFIG } from '../config/config'
import {
  lexPostCall,
  setLanguage,
  setActionType,
  resetIdleTimer,
  pushMessages,
  agentAvailable,
} from '../ducks/lexClient'
import { ACTION_TYPE, BOT_INQUIRY_OPTIONS } from '../helper/enum'
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
  (message, isBot) => async (dispatch, getState) => {
    const { lexThread } = getState().lexClient
    const newThread = [...lexThread, { message, type: isBot ? 'bot' : 'human' }]

    dispatch(pushMessages(newThread))
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
    const caseData = Util.parseCreateCaseResponse(result.data)

    const initLiveAgentSession = async () => {
      const session = await service.startSession()
      const getMessage = async (payload) => await service.getMessage(payload)

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
            const hasJoinedResponse = await translator(
              language,
              CONFIG.LIVE_AGENT.HAS_JOINED
            )

            if (hasJoinedResponse.status === 200) {
              const payload = {
                session: ConstructPayload.sessionPayload(session?.data),
                targetLanguage: language
              
              }
             await getMessage(payload)
            }
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
          waitingForAgentResponse.data?.translation || waitingForAgent,
          "bot"
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
  }
}
