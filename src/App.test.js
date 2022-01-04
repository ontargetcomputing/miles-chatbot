import { shallow } from "enzyme"
import App from "./App"

describe("App", () => {
  it("Test App component", () => {
    const wrapper = shallow(<App />)
    console.log("wrapper", wrapper.debug)
    expect(wrapper.length).toEqual(1)
    expect(wrapper.find("h1").text()).toEqual("React App")
  })
})
