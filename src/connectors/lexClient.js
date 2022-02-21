import { Interactions } from 'aws-amplify'
import { lexPostCall } from '../ducks/lexClient'

export const leXTextCall = () => async dispatch => {
  const userInput = 'DL'
  const response = await Interactions.send(
    process.env.REACT_APP_MILES_BOT,
    userInput
  )
  dispatch(lexPostCall(response))
}
