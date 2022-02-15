import { configureStore } from "@reduxjs/toolkit"
import lexClient from "./ducks/lexClient"

const store = configureStore({
  reducer: {
    lexClient,
  },
  devTools: window.location.port,
})

export default store
