import { createReducer, createAction } from '@reduxjs/toolkit';
import { ACTION_TYPE, LIVECHAT_STATUS } from '../helper/enum';
export const lexPostCall = createAction('lexClient/lexPostCall');
export const setSearchTerm = createAction('lexClient/setSearchTerm');
export const setActionType = createAction("lexClient/setActionType");
export const setLanguage = createAction("lexClient/setLanguage");
export const setEndChat = createAction("lexClient/setEndChat");
export const resetIdleTimer = createAction("lexClient/resetIdleTimer");
export const pushMessages = createAction("lexClient/pushMessages");
export const agentAvailable = createAction("lexClient/agentAvailable");
export const setliveChat = createAction("lexClient/setliveChat");
export const setSessionData = createAction("lexClient/setSessionData");
export const setIsLoading = createAction("lexClient/setIsLoading");
export const setIsAgentTyping = createAction("lexClient/setIsAgentTyping");
export const setIsFeedbackUpdated = createAction("lexClient/setIsFeedbackUpdated");
export const setUserDetails = createAction("lexClient/userDetails")

const initialState = {
  isLoading: false,
  lexThread: [],
  searchTerm: 'QID::Welcome',
  actionType: ACTION_TYPE.DEFAULT,
  language: "en",
  chatEnded: {
    isChatEnded: false,
    message: ''
  },
  agentAvailable: false,
  isAgentTyping: false,
  liveChat: { status: LIVECHAT_STATUS.DISCONNECTED },
  sessionData: {},
  isFeedbackUpdated: false,
  userDetails:{}
}

export default createReducer(initialState, {
  [lexPostCall]: (state, action) => {
    state.lexThread = action.payload
  },
  [setSearchTerm]: (state, action) => {
    state.searchTerm = action.payload
  },
  [setActionType]: (state, action) => {
    state.actionType = action.payload;
  },
  [setLanguage]: (state, action) => {
    state.language = action.payload;
  },
  [setEndChat]: (state, action) => {
    state.chatEnded = action.payload
    state.sessionData = {},
      state.liveChat = { status: LIVECHAT_STATUS.DISCONNECTED }
  },
  [resetIdleTimer]: (state) => {
    state.resetIdleTime = (new Date()).getTime();
  },
  [pushMessages]: (state, action) => {
    state.lexThread = action.payload
  },
  [agentAvailable]: (state, action) => {
    state.agentAvailable = action.payload;
  },
  [setliveChat]: (state, action) => {
    if (action?.payload) {
      state.liveChat = action.payload;
    } else {
      state.liveChat = { status: LIVECHAT_STATUS.DISCONNECTED };
    }
  },
  [setSessionData]: (state, action) => {
    state.sessionData = action.payload
  },
  [setIsLoading]: (state, action) => {
    state.isLoading = action.payload
  },
  [setIsAgentTyping]: (state, action) => {
    state.isAgentTyping = action.payload  
  },
  [setIsFeedbackUpdated]: (state, action) => {
    state.isFeedbackUpdated = action.payload
  },
  [setUserDetails]: (state, action) => {
    state.userDetails={...action.payload, ...state.userDetails}
  },
})
