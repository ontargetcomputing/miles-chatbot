import React, { useState as useStateMock } from 'react'
import ChatInput from "../components/ChatInput"
import { mount } from "enzyme"
import * as redux from 'react-redux'
import { fireEvent, render, screen } from "@testing-library/react"
import { ThemeProvider } from "styled-components"
import { theme } from "../../../miles-chatbot/src/Theme"

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))
describe("ChatInput Component tested with user event", () => {
  const dispatchFn = jest.fn();
  const useDispatchMock = jest.spyOn(redux, 'useDispatch');
  const useSelectorSpy = jest.spyOn(redux, 'useSelector');
  const setState = jest.fn();

  beforeEach(() => {
    useSelectorSpy.mockImplementation(callback => callback({ lexClient: { actionType: "Language" } }));
    useStateMock.mockImplementation(init => [init, setState])
    useDispatchMock.mockReturnValue(dispatchFn);
  });

  afterEach(() => jest.clearAllMocks());

  it("Chat input component rendered", () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <ChatInput />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1);
  });

  it("Start chart with user input", () => {    
    render( <ThemeProvider theme={theme}>
      <ChatInput />
    </ThemeProvider>);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: 'License' } });
    expect(setState).toBeCalledWith("License");

    fireEvent.click(screen.getByRole("button"));

    expect(dispatchFn).toBeCalledTimes(1);
  })
})



// describe("ChatInput", () => {
//   beforeEach(() => {
//     useSelectorSpy.mockImplementation(callback => {
//       return callback({ lexClient: { actionType: "Language" } });
//     });

//     useDispatchMock.mockReturnValue(dispatchFn);
//   })
//   it("ChatInput component", () => {
//     const wrapper = shallow(<ChatInput />)
//     expect(wrapper.length).toEqual(1)
//   })

//   it("Start chart with user input", () => {

//     const setStateMock = jest.fn();
//     const useStateMock = useState => [useState, setStateMock];
//     jest.spyOn(React, 'useState').mockImplementation(useStateMock);

//     render(<ChatInput />);

//     fireEvent.change(screen.getByRole("textbox"), { target: { value: 'License' } });
//     fireEvent.click(screen.getByRole("button"));
//     expect(dispatchFn).toHaveBeenCalled()
//   })
// })
