import Header from "../components/Header"
import { mount } from "enzyme"
import { ThemeProvider } from "styled-components"
import { theme } from "../Theme"

describe("Header", () => {
  it("Header component", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1)
  })
})
