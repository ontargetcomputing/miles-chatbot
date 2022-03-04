import { mount } from "enzyme"
import Button from "../components/Button"
import { ThemeProvider } from "styled-components"
import { theme } from "../Theme"

describe("Button", () => {
  it("Button component", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Button />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1)
  })
})



