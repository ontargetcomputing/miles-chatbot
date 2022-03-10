import React, { useState as useStateMock } from 'react'
import { mount } from "enzyme"
import * as redux from 'react-redux'
import { ThemeProvider } from "styled-components"
import { theme } from "../../../miles-chatbot/src/Theme"
import ChatMessagesLayout from '../components/ChatMessagesLayout'

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
        <ChatMessagesLayout />
      </ThemeProvider>
    )
    expect(wrapper.length).toEqual(1);
  });
})