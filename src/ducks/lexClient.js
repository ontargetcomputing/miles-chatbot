import { createReducer, createAction } from '@reduxjs/toolkit'
export const lexPostCall = createAction('lexClient/lexPostCall')
export const setSearchTerm = createAction('lexClient/setSearchTerm')

const initialState = {
  lexResponse: [],
  searchTerm: 'QID::Welcome',
}

export default createReducer(initialState, {
  [lexPostCall]: (state, action) => {
    state.lexResponse = action.payload
  },
  [setSearchTerm]: (state, action) => {
    state.searchTerm = action.payload
  },
})
