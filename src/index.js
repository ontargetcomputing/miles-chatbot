import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Amplify from "aws-amplify"
import { Provider } from "react-redux"
import store from "./store"
     
const amplifyConfig = {
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
  },
  Interactions: {
    bots: {},
  },
}

amplifyConfig.Interactions.bots[process.env.REACT_APP_MILES_BOT] = {
        name: process.env.REACT_APP_MILES_BOT,
        alias: process.env.REACT_APP_ALIAS,
        region: process.env.REACT_APP_AWS_REGION,
      }
      

Amplify.configure(amplifyConfig)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals