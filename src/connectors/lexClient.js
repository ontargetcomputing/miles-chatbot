import { Interactions } from 'aws-amplify'
import { lexPostCall, setLanguage, setActionType, resetIdleTimer } from '../ducks/lexClient'
import { ACTION_TYPE } from "../helper/enum"

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
        date: new Date()
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
    date: new Date()
  }
  const newThread = [...lexThread, value]
  dispatch(lexPostCall(newThread));
  dispatch(leXTextCall(query));
};

export const botButtonAction = buttonItem => (dispatch, getState) => {
  const { lexThread } = getState().lexClient;
  const isAgentAvailable = lexThread.length && lexThread[lexThread.length - 1]?.isAgentAvailable;

  const displayText = isAgentAvailable ? buttonItem.text : "";
  dispatch(searchQuery(buttonItem.value, displayText));
}