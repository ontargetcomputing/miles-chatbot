import Header from "./components/Header"
import Layout from "./components/Layout"
import Theme from "./Theme"
// import { Button, BUTTON_STYLE_PRIMARY } from "@ca-dmv/core"
// import { ThemeProvider } from "styled-components";
function App() {
  return (
    <Theme>
      <Header />
      <Layout />
      {/* <Button label="Primary" btnStyle={BUTTON_STYLE_PRIMARY} /> */}
    </Theme>
  )
}

export default App
