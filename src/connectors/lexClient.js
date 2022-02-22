import { Interactions } from 'aws-amplify'
import { lexPostCall, setSearchTerm } from '../ducks/lexClient'

export const leXTextCall = searchTerm => async (dispatch, getState) => {
  try {
    const { lexThread } = getState().lexClient
    const response = await Interactions.send(
      process.env.REACT_APP_MILES_BOT,
      searchTerm
    )
    const newThread = [
      ...lexThread,
      {
        message: response.message,
        buttons: response?.responseCard?.genericAttachments[0]?.buttons
          ? response?.responseCard?.genericAttachments[0]?.buttons
          : [],
        type: 'bot',
      },
    ]
    dispatch(lexPostCall(newThread))
  } catch(err){
   console.log(err)
  }
}

export const searchQuery = query => (dispatch, getState) => {
  const { lexThread } = getState().lexClient
  const value = {
    type: 'human',
    message: query,
  }
  const newThread = [...lexThread, value]
  dispatch(lexPostCall(newThread))
  dispatch(setSearchTerm(query))
}
;[
  { message: '', buttons: [], type: 'bot' },
  { msg: 'hello', tpe: 'human' },
]
