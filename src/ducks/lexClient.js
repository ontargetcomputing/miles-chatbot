import { createReducer, createAction } from '@reduxjs/toolkit';
import { ACTION_TYPE } from '../helper/enum';
export const lexPostCall = createAction('lexClient/lexPostCall');
export const setSearchTerm = createAction('lexClient/setSearchTerm');
export const setActionType = createAction("lexClient/setActionType");
export const setLanguage = createAction("lexClient/setLanguage");
export const setEndChat = createAction("lexClient/setEndChat");

const initialState = {
  lexThread: [],
  searchTerm: '',
  actionType: ACTION_TYPE.DEFAULT,
  language: "en",
  isChatEnded: false
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
    state.searchTerm = initialState.searchTerm
  },
  [setEndChat]: (state, action) => {
    state.isChatEnded = action.payload;
  }
})
