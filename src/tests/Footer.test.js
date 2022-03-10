import Footer from "../components/Footer"
import { fireEvent, render, screen } from "@testing-library/react"
import { ACTION_TYPE } from "../helper/enum"
import * as redux from 'react-redux'

const dispatchFn = jest.fn();
const useDispatchMock = jest.spyOn(redux, 'useDispatch').mockReturnValue(dispatchFn);
const spy = jest.spyOn(redux, 'useSelector')


describe("Footer", () => {
beforeEach(()=>{
  spy.mockImplementation(callback => callback({ lexClient: { actionType: "Language" } }));
})
  it("Footer component", () => {
    render(<Footer />);    
  })

  it("Footer buttons are not visible if the action type is Language", () => {
    const wrapper= render(<Footer />);
    expect(wrapper.queryAllByRole("button").length).toBe(0);
  });

  it("Verified action button event fired with expected parameter", () => { 
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(dispatchFn);
    spy.mockImplementation(callback => callback({ lexClient: { actionType: ACTION_TYPE.DEFAULT } }));
     render(<Footer />);
    fireEvent.click(screen.getByText("Languages"));
    expect(dispatchFn).toHaveBeenLastCalledWith({ "payload": "Language", "type": "lexClient/setActionType" })
  });
})
