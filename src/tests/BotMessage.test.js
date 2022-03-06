import BotMessage from "../components/BotMessage"
import { mount } from "enzyme"
import { ThemeProvider } from "styled-components"
import { theme } from "../Theme"

describe("BotMessage", () => {
  it("BotHeader component", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <BotMessage />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1)
  })
})
