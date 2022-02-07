import Layout from "../components/Layout"
import { shallow } from "enzyme"

describe("Layout", () => {
  it("Layout component", () => {
    const wrapper = shallow(<Layout />)
    expect(wrapper.length).toEqual(1)
  })
})
