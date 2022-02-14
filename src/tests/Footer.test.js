import Footer from "../components/Footer"
import { shallow } from "enzyme"

describe("Footer", () => {
  it("Footer component", () => {
    const wrapper = shallow(<Footer />)
    expect(wrapper.length).toEqual(1)
  })
})
