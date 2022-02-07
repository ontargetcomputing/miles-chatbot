import ChatInput from "../components/ChatInput"
import { shallow } from "enzyme"

describe("ChatInput", () => {
  it("ChatInput component", () => {
    const wrapper = shallow(<ChatInput />)
    expect(wrapper.length).toEqual(1)
  })
})
