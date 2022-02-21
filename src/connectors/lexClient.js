import { Interactions } from 'aws-amplify'
import { lexPostCall, setSearchTerm } from '../ducks/lexClient'

export const leXTextCall = searchTerm => async (dispatch, getState) => {
  const { lexResponse } = getState().lexClient
  const response = await Interactions.send(
    process.env.REACT_APP_MILES_BOT,
    searchTerm
  )
  const newThread = [
    ...lexResponse,
    {
      message: response.message,
      buttons: response?.responseCard?.genericAttachments[0]?.buttons
        ? response?.responseCard?.genericAttachments[0]?.buttons
        : [],
      type: 'bot',
    },
  ]

  dispatch(lexPostCall(newThread))
}

export const searchQuery = query => (dispatch, getState) => {
  const { lexResponse } = getState().lexClient
  const value = {
    type: 'human',
    message: query,
  }
  const newThread = [...lexResponse, value]
  dispatch(lexPostCall(newThread))
  dispatch(setSearchTerm(query))
}
;[
  { message: '', buttons: [], type: 'bot' },
  { msg: 'hello', tpe: 'human' },
]
