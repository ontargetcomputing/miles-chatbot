import { Interactions } from 'aws-amplify'
import { lexPostCall, setLanguage, setActionType } from '../ducks/lexClient'
import { ACTION_TYPE } from "../helper/enum"

export const leXTextCall = (searchTerm, initialRender=false) => async (dispatch, getState) => {
  try {
    const { lexThread } = getState().lexClient
    const response = await Interactions.send(
      process.env.REACT_APP_MILES_BOT,
      searchTerm
    )
    const newThread = [
      ...lexThread,
      {
        message: initialRender ?  "" :response.message,
        buttons: response?.responseCard?.genericAttachments[0]?.buttons
          ? response?.responseCard?.genericAttachments[0]?.buttons
          : [],
        type: 'bot',
        topic: response?.sessionAttributes?.topic
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

export const changeLanguage = (language) => async (dispatch) => {
  if (language) {
    dispatch(leXTextCall(language.label));  // arabic    
    dispatch(setActionType(ACTION_TYPE.DEFAULT));
  }
}

export const searchQuery = query => (dispatch, getState) => {
  const { lexThread } = getState().lexClient
  const value = {
    type: 'human',
    message: query,
  }
  const newThread = [...lexThread, value]
  dispatch(lexPostCall(newThread));
  dispatch(leXTextCall(query));
};