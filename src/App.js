import { createGlobalStyle } from 'styled-components'
import Header from "./components/Header"
import Footer from "./components/Footer";
import Layout from "./components/Layout"
import Theme from "./Theme"

// import { Button, BUTTON_STYLE_PRIMARY } from "@ca-dmv/core"
// import { ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
html, body, #root, .content-container{
  height:100%;
  width:100%;
}`;

function App() {
  return (
    <Theme>
      <GlobalStyle/>
      <Header />
      <Layout />
      <Footer/>
    </Theme>
  )
}

export default App
