import { BUTTON_STYLE_SECONDARY } from '@ca-dmv/core'
import Button from './Button'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { setActionType } from '../ducks/lexClient'
import { ACTION_TYPE } from '../helper/enum'
import { Locale } from "../locale/locale";
import { endChat } from '../connectors/lexClient'
import { LIVECHAT_STATUS } from '../helper/enum'

const resource = (languageCode, key) => {
  const stringResource = Locale[languageCode] || Locale["en"];

  return stringResource[key] || `--${key}--`;
}

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
  const { actionType, language, chatEnded, liveChat } = useSelector(store => store.lexClient);
  const { isChatEnded } = chatEnded
  const { status } = liveChat
  return (
    <FooterContainer className='flex flex--nowrap flex--align-center flex--justify-content-start'>
      {ACTION_TYPE.LANGUAGES !== actionType &&
        <>
          <Button
            label={resource(language, "saveChat")}
            btnStyle={BUTTON_STYLE_SECONDARY}
            buttonClass='cb-button'
          />
            <Button
              onClick={() => dispatch(setActionType(ACTION_TYPE.LANGUAGES))}
              label={resource(language, "language")}
              btnStyle={BUTTON_STYLE_SECONDARY}
              buttonClass='cb-button'
              disabled={isChatEnded || status === LIVECHAT_STATUS.ESTABLISHED}
            />
            <Button
              onClick={() => dispatch(endChat())}
              label={resource(language, "endChat")}
              btnStyle={BUTTON_STYLE_SECONDARY}
              buttonClass='cb-button'
              disabled={isChatEnded}
            />
        </>}
    </FooterContainer>
  )
}

export default Footer
