import { mount } from "enzyme"
import { ThemeProvider } from "styled-components"
import ChangeLanguage from "../components/ChangeLanguage"
import { theme } from "../Theme"
import { fireEvent, render, screen } from "@testing-library/react"
import * as redux from 'react-redux'

const dispatchFn = jest.fn();
const useDispatchMock = jest.spyOn(redux, 'useDispatch');
const useSelectorSpy = jest.spyOn(redux, 'useSelector');

describe("Languages", () => {
    beforeEach(() => {
        useSelectorSpy.mockImplementation(callback => {
            return callback({ lexClient: { actionType: "Language" } });
        });

        useDispatchMock.mockReturnValue(dispatchFn);
    })

    it("ChangeLanguage Component Rendered", () => {
        render(
            <ThemeProvider theme={theme}>
                <ChangeLanguage />
            </ThemeProvider>
        );
    });

    it("Language back button event fired", () => {
        render(<ChangeLanguage />)

        fireEvent.click(screen.getByRole("button"));
        expect(dispatchFn).toHaveBeenCalledWith({"payload": "Default", "type": "lexClient/setActionType"});
    })
})