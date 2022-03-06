import { mount, shallow } from "enzyme"
import { fireEvent, render, screen } from "@testing-library/react"
import { ACTION_TYPE } from "../helper/enum"
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
        expect(screen.getByText("Custome Message")).toBeInTheDocument();
    })
})



