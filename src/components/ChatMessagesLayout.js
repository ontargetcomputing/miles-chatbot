
import Button from './Button'
import Markdown from 'react-markdown'
import BotMessage from './BotMessage'
import { BOT_TYPE, FEEDBACK_TYPE, LIVECHAT_STATUS, TOPIC } from '../helper/enum'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { botButtonAction } from '../connectors/lexClient'
import UserMessage from './UserMessage'
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { leXTextCall } from '../connectors/lexClient'
import { setIsFeedbackUpdated } from '../ducks/lexClient'


const ButtonWrapper = styled.div`
margin-left: 12px;
`

export const MessageText = styled.p`
text-align: center;
color: ${props => props.theme.colors.orange.corangedark1};
margin: 10px;
`

const FeedbackSection = styled.div`
display: flex;
img {
  padding-left: 10px;
}
`
const thumpsup = 'assets/images/thums-up.svg'
const thumpsdown = 'assets/images/thums-down.svg'

const RenderMessages = ({ res, isEnableThumps }) => {
  const dispatch = useDispatch();

  const onClickFeedbackIcon = (feedbackType) => {
    dispatch(setIsFeedbackUpdated(true));
    dispatch(leXTextCall(feedbackType));
  }
  const url = process.env.REACT_APP_ASSETS_URL ? true : false
  const thumpsUpPath = url ? `${process.env.REACT_APP_ASSETS_URL}/${thumpsup}` : `./${thumpsup}`
  const thumpsDownPath = url ? `${process.env.REACT_APP_ASSETS_URL}/${thumpsdown}` : `./${thumpsdown}`
  const message = res?.message?.replace(/]\s\(/g, "](")
  return (
    <>
      {res.message && <>
        <div className='bp-md:w--90 p-10'>
          <BotMessage type={res.type}>
            <Markdown linkTarget="_blank">{message}</Markdown>
          </BotMessage>
        </div>
        {isEnableThumps && <FeedbackSection>
          <img src={`${thumpsUpPath}`} alt="logo" onClick={() => onClickFeedbackIcon(FEEDBACK_TYPE.THUMBS_UP)} />
          <img src={`${thumpsDownPath}`} alt="logo" onClick={() => onClickFeedbackIcon(FEEDBACK_TYPE.THUMBS_DOWN)} />
        </FeedbackSection>}
      </>
      }
    </>
  )
}


RenderMessages.propTypes = {
  res: PropTypes.any,
  isEnableThumps: PropTypes.bool
}

export default function ChatMessagesLayout() {
  const { lexThread, chatEnded, agentAvailable, liveChat, isFeedbackUpdated } = useSelector(store => store.lexClient);
  const { isChatEnded, message } = chatEnded
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const scrollToBottom = () => messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [lexThread]);

  const lexThreadCount = lexThread.length;
  const disable = index => isChatEnded || lexThreadCount > index + 1;
  const isEnableThumps = !isFeedbackUpdated && lexThreadCount > 2 && !agentAvailable &&
    liveChat?.status === LIVECHAT_STATUS.DISCONNECTED;

  const actionButtons = (res, index) => {
    const showOnlyBackToHomeButton = agentAvailable && res?.topic === TOPIC.STARTING;
    let linkButton =showOnlyBackToHomeButton? res.buttons?.slice(-2):res.buttons;
    
      
    return linkButton?.map(btn => (
      <Button disabled={disable(index)} key={btn.text} label={btn.text} onClick={() => {
        !dispatch(botButtonAction(btn))
        isFeedbackUpdated && dispatch(setIsFeedbackUpdated(false));
      }}
      />
    ));
  }
  return (
    <>
      {lexThread.map((res, index) =>
        (res.type === BOT_TYPE.BOT || res.type === BOT_TYPE.AGENT) ? (
          <div key={index}>
            <RenderMessages res={res} isEnableThumps={isEnableThumps && !disable(index)} />
            <ButtonWrapper className='flex'>
              {actionButtons(res, index)}
            </ButtonWrapper>
          </div>
        ) : (
          <UserMessage key={index}>{res.message}</UserMessage>
        )
      )}
      <div ref={messagesEndRef} />
      {isChatEnded && <MessageText>{message}</MessageText>}
    </>
  )

}
