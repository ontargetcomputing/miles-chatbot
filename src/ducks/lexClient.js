import { createReducer, createAction } from '@reduxjs/toolkit'

export const lexPostCall = createAction('lexClient/lexPostCall')

const initialState = {
  lexResponse: {},
}

export default createReducer(initialState, {
  [lexPostCall]: (state, action) => {
    state.lexResponse = action.payload
  },
})
