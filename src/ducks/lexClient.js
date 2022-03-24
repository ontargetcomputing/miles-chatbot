import { createReducer, createAction } from '@reduxjs/toolkit';
import { ACTION_TYPE, LIVECHAT_STATUS } from '../helper/enum';
export const lexPostCall = createAction('lexClient/lexPostCall');
export const setSearchTerm = createAction('lexClient/setSearchTerm');
export const setActionType = createAction("lexClient/setActionType");
export const setLanguage = createAction("lexClient/setLanguage");
export const setEndChat = createAction("lexClient/setEndChat");
export const resetIdleTimer = createAction("lexClient/resetIdleTimer");
export const pushMessages = createAction("lexClient/pushMessages")
export const agentAvailable = createAction("lexClient/agentAvailable")
export const setliveChat = createAction("lexClient/setliveChat")
export const setSessionData =  createAction("lexClient/setSessionData")

const initialState = {
  lexThread: [],
  searchTerm: 'QID::Welcome',
  actionType: ACTION_TYPE.DEFAULT,
  language: "en",
  chatEnded: {
    isChatEnded: false,
    message: ''
  },
  agentAvailable: false,
  liveChat: { status: LIVECHAT_STATUS.DISCONNECTED },
  sessionData: {}
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
  }
})
