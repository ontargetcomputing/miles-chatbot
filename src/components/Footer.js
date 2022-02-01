import { BUTTON_STYLE_SECONDARY } from "@ca-dmv/core"
import Button from "./Button"
import styled from "styled-components"

const FooterContainer = styled.div`
  height: 61px;
  padding: 0px 2px;
  bottom: 0;
  width: 100%;
  background: var(--c-blue);
  @media (max-width: 600px) {
    justify-content: center;
  }
`

const ActionButton = styled(Button)`
  @media (max-width: 600px) {
    margin: 7.5px 4px;
  }
  @media (max-width: 280px) {
    padding: 5px 8px;
    margin: 0 1px;
  }
`

function Footer() {
  return (
    <FooterContainer className="flex flex--nowrap flex--align-center flex--justify-content-start">
      <ActionButton sm label="Save Chat" btnStyle={BUTTON_STYLE_SECONDARY} buttonClass="cb-button" />
      <ActionButton sm label="Languages" btnStyle={BUTTON_STYLE_SECONDARY} buttonClass="cb-button" />
      <ActionButton sm label="End Chat" btnStyle={BUTTON_STYLE_SECONDARY} buttonClass="cb-button" />
    </FooterContainer>
  )
}

export default Footer
