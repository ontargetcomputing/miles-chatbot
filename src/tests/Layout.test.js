import { shallow } from "enzyme"
import * as redux from 'react-redux'
import React from "react";
import React, { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import App from "../App";
import Layout from "../components/Layout";

const dispatchFn = jest.fn();
const useSelectorSpy = jest.spyOn(redux, 'useSelector');
const useDispatchMock = jest.spyOn(redux, 'useDispatch');
describe("Layout", () => {
  beforeEach(() => {
    useSelectorSpy.mockImplementation(callback => {
      return callback({ lexClient: { actionType: "Language", lexThread:[{topic:'language.changed'}] } });
    });

    useDispatchMock.mockReturnValue(dispatchFn);
  });

  it("Layout component", () => {
    const wrapper = shallow(<ThemeProvider theme={theme}><Layout /></ThemeProvider>)
    expect(wrapper.length).toEqual(1)
  });

  it("Layout verified with action type Language", () => {
    const wrapper = render(<ThemeProvider theme={theme}><Layout /></ThemeProvider>)
    expect(wrapper.container.getElementsByClassName("cb-full-height").length).toEqual(1)
  })

  it("Layout verified with action type Default", () => {
    useDispatchMock.mockClear();
    useDispatchMock.mockReturnValue({ lexClient: { actionType: "Default" } })
    const wrapper = render(<ThemeProvider theme={theme}><Layout /></ThemeProvider>)
    expect(wrapper.container.getElementsByClassName("cb-full-height").length).toEqual(1)
  })

  it("Verified with topic 'language changed'", ()=>{
    jest.spyOn(React, "useEffect").mockImplementationOnce(cb => cb()());
    render(<ThemeProvider theme={theme}><Layout /></ThemeProvider>)

  })
})
