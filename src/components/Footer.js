import { BUTTON_STYLE_SECONDARY } from '@ca-dmv/core'
import Button from './Button'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { setActionType } from '../ducks/lexClient'
import { ACTION_TYPE } from '../helper/enum'

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
  const dispatch = useDispatch();
  const { actionType } = useSelector(store => store.lexClient);
  return (
    <FooterContainer className='flex flex--nowrap flex--align-center flex--justify-content-start'>
      {ACTION_TYPE.LANGUAGES !== actionType &&
        <>
          <Button
            label='Save Chat'
            btnStyle={BUTTON_STYLE_SECONDARY}
            buttonClass='cb-button'
          />
          <Button
            onClick={() => dispatch(setActionType(ACTION_TYPE.LANGUAGES))}
            label='Languages'
            btnStyle={BUTTON_STYLE_SECONDARY}
            buttonClass='cb-button'
          />
          <Button
            label='End Chat'
            btnStyle={BUTTON_STYLE_SECONDARY}
            buttonClass='cb-button'
          />
        </>}
    </FooterContainer>
  )
}

export default Footer
