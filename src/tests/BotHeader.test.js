import BotHeader from "../components/BotHeader"
import { mount } from "enzyme"
import { ThemeProvider } from "styled-components"
import { theme } from "../Theme"

describe("BotHeader", () => {
  it("BotHeader component", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <BotHeader />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1)
  })
})
