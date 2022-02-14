import styled from "styled-components"
import { InputText, BUTTON_STYLE_PRIMARY } from "@ca-dmv/core"
import ActionButton from "./Button"

const StartHereWrapper = styled.div`
  height: 65px;
  background-color: var(--c-gray-dark-1);
  box-shadow: 0px -2px 12px rgba(0, 0, 0, 0.25);
  .cb-input-container {
    flex: 1 1 0;
  }
`

const Button = styled(ActionButton)`
  border-radius: var(--border-radius);
  padding: 0 var(--spacing-unit-20);
  height: 38px;
`

function ChatInput() {
  return (
    <StartHereWrapper className="flex flex--align-center pl-30 pr-30">
      <InputText hideLabel placeholder="Start Chart" inputClass="" containerClass="cb-input-container" />
      <Button label="Start" btnStyle={BUTTON_STYLE_PRIMARY} buttonClass="ml-10 mt-3 mr-30" />
    </StartHereWrapper>
  )
}

export default ChatInput
