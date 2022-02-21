import { BUTTON_STYLE_SECONDARY } from '@ca-dmv/core'
import Button from './Button'
import styled from 'styled-components'

const FooterContainer = styled.div`
  height: 81px;
  padding: 0px 2px;
  bottom: 0;
  width: 100%;
  background: var(--c-blue);
  @media (max-width: 600px) {
    justify-content: center;
    height: 61px;
  }
`

function Footer() {
  return (
    <FooterContainer className='flex flex--nowrap flex--align-center flex--justify-content-start'>
      <Button
        label='Save Chat'
        btnStyle={BUTTON_STYLE_SECONDARY}
        buttonClass='cb-button'
      />
      <Button
        label='Languages'
        btnStyle={BUTTON_STYLE_SECONDARY}
        buttonClass='cb-button'
      />
      <Button
        label='End Chat'
        btnStyle={BUTTON_STYLE_SECONDARY}
        buttonClass='cb-button'
      />
    </FooterContainer>
  )
}

export default Footer
