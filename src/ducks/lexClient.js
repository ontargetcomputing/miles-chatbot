import { createReducer, createAction } from "@reduxjs/toolkit"
import { Interactions } from "aws-amplify"

export const leXTextCall = () => async (dispatch) => {
  const userInput = "QID::Welcome"
  const response = await Interactions.send(process.env.REACT_APP_MILES_BOT, userInput)
  dispatch(lexPostCall(response))
}

export const lexPostCall = createAction("lexClient/lexPostCall")

const initialState = {
  lexResponse: "",
}

export default createReducer(initialState, {
  [lexPostCall]: (state, action) => {
    // eslint-disable-next-line no-param-reassign
    state.lexResponse = action.payload
  },
})
