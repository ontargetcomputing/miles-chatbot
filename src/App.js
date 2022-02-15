import { createGlobalStyle } from "styled-components"
import { useDispatch } from "react-redux"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Layout from "./components/Layout"
import Theme from "./Theme"
import { useEffect } from "react"
import { leXTextCall } from "./ducks/lexClient"
// import { Interactions } from "aws-amplify"

const GlobalStyle = createGlobalStyle`
html, body, #root, .content-container{
  height:100%;
  width:100%;
}`

function App() {
  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(leXTextCall())
  }, [dispatch])
  return (
    <Theme>
      <GlobalStyle />
      <Header />
      <Layout />
      <Footer />
    </Theme>
  )
}

export default App
