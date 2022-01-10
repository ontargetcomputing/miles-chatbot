import Header from "./components/Header"
import Theme from "./Theme"
// import { Button, BUTTON_STYLE_PRIMARY } from "@ca-dmv/core"
// import { ThemeProvider } from "styled-components";
function App() {
  return (
    <Theme>
      <Header />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pellentesque lacus eros, vitae venenatis lacus
        fermentum ut. Cras eget massa purus. Morbi in metus eu nunc maximus pulvinar eu maximus dolor.
      </p>
      {/* <Button label="Primary" btnStyle={BUTTON_STYLE_PRIMARY} /> */}
    </Theme>
  )
}

export default App
