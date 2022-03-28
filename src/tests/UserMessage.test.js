import { mount } from "enzyme"
import UserMessage from "../components/UserMessage";
import { ThemeProvider } from "styled-components";
import { theme } from "../../../miles-chatbot/src/Theme";

jest.mock('react-redux', () => ({
    useDispatch: () => { },
    useSelector: () => ({ lexClient: { actionType: "Language" } })
}));

describe("Button", () => {
    it("UserMessage component", () => {
        const wrapper = mount(
            <ThemeProvider theme={theme}>
                <UserMessage><p>Custome Message</p></UserMessage>
            </ThemeProvider>
        )
        expect(wrapper.length).toBe(1)
        expect(screen.getByText("Custome Message")).toBeInTheDocument();
    })
})



