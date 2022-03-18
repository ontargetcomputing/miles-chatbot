import { Interactions } from 'aws-amplify'
import { CONFIG } from '../config/config';
import { lexPostCall, setLanguage, setActionType, resetIdleTimer, pushMessages, agentAvailable } from '../ducks/lexClient'
import { ACTION_TYPE, BOT_INQUIRY_OPTIONS } from "../helper/enum"
import { Util } from '../helper/Util';
import { axiosWithRetry } from './base-service.js/axios-wrapper';

export const leXTextCall = (searchTerm, initialRender = false) => async (dispatch, getState) => {
  try {
    dispatch(resetIdleTimer());
    const { lexThread } = getState().lexClient;
    const response = await Interactions.send(
      process.env.REACT_APP_MILES_BOT,
      searchTerm
    );

    processResponse(response);

    const newThread = [
      ...lexThread,
      {
        message: initialRender ? "" : response.message,
        buttons: response?.responseCard?.genericAttachments[0]?.buttons
          ? response?.responseCard?.genericAttachments[0]?.buttons
          : [],
        type: 'bot',
        topic: response?.sessionAttributes?.topic,
        isAgentAvailable: response?.sessionAttributes.agents_available === "true",
        sessionAttributes: response?.sessionAttributes
      },
    ];

    dispatch(lexPostCall(newThread));

    let qnabotcontext = response?.sessionAttributes?.qnabotcontext;

    if (qnabotcontext) {
      qnabotcontext = JSON.parse(qnabotcontext);
      dispatch(setLanguage(qnabotcontext.userLocale));
    }

  } catch (err) {
    console.log(err)
  }
}

const processResponse = (data) => {
  if (data.sessionAttributes.topic === 'liveChatStatus.starting') {
    const agent_available = data.sessionAttributes.agents_available;
    const buttonsArray = data.responseCard.genericAttachments[0].buttons;

    const newButtonsArray = [...buttonsArray.slice(0, 2)];
    newButtonsArray[0].value = 'QID::20.livechat.firstname';
    newButtonsArray[1].value = 'QID::Welcome';

    if (newButtonsArray.length >= 4 && agent_available !== "true") {
      newButtonsArray.push(buttonsArray.slice(2, 5));
      newButtonsArray[2].value = '';
      newButtonsArray[3].value = '';
    }
    data.responseCard.genericAttachments[0].buttons = newButtonsArray;
  }
}

export const changeLanguage = (language) => async (dispatch) => {
  if (language) {
    dispatch(leXTextCall(language.label));  // arabic    
    dispatch(setActionType(ACTION_TYPE.DEFAULT));
  }
}

export const searchQuery = (query, displayText = "") => (dispatch, getState) => {
  const { lexThread } = getState().lexClient
  const value = {
    type: 'human',
    message: displayText || query,
  }
  const newThread = [...lexThread, value]
  dispatch(lexPostCall(newThread));
  dispatch(leXTextCall(query));
};

export const botButtonAction = buttonItem => (dispatch, getState) => {
  const { lexThread } = getState().lexClient;
  const recentThread = lexThread.length && lexThread[lexThread.length - 1];
  const isAgentAvailable = recentThread?.isAgentAvailable;
  dispatch(agentAvailable(isAgentAvailable))

  if (isAgentAvailable && buttonItem.text === BOT_INQUIRY_OPTIONS.DRIVER_LICENSE) {
    dispatch(createCase(recentThread, buttonItem.text));

    return;
  } 
  const displayText = isAgentAvailable &&  buttonItem.text
  dispatch(searchQuery(buttonItem.value, displayText));
}

export const translator = async (targetLanguage, message) => {
  const config = {
    method: 'post',
    url: `${CONFIG.LIVE_AGENT.ENDPOINT}/translate`,
    data: { targetLanguage, message },
  };

  return axiosWithRetry(config);

}

export const createCase = (lexThreadRecentItem, buttonText) => async (dispatch, getState) => {
  const {  lexThread, language } = getState().lexClient;
  const data = Util.getCreateCasePayload(lexThreadRecentItem, language, buttonText);

  if (data) {
    const createCaseConfig = {
      method: 'post',
      url: `${CONFIG.LIVE_AGENT.ENDPOINT}/createCase`,
      data
    };

    const result = await axiosWithRetry(createCaseConfig);
    if (result.status === 200) {
      const casenumber = result.data[0].outputValues.var_CaseNumber
        const msg = `Thank you for contacting us. We have logged case number ${casenumber} for your inquiry.  Please wait for the next available agent.`
      const message = await translator(language, msg);
      const newThread = [
        ...lexThread,
        {
          message: message?.data?.translation,
          type: 'bot'
        },
      ];
      dispatch(pushMessages(newThread))
      // console.log(result);
      // console.log('waitingMessage', translator2)
    }

  } else {
    //TODO show error message
  }
}