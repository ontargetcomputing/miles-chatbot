
import Button from './Button'
import Markdown from 'react-markdown'
import BotMessage from './BotMessage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { botButtonAction } from '../connectors/lexClient'
import UserMessage from './UserMessage'
import styled from 'styled-components'
import PropTypes from 'prop-types';
import { leXTextCall } from '../connectors/lexClient'


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
const thumpsup = './assets/images/thums-up.svg'
const thumpsdown = './assets/images/thums-down.svg'

const RenderMessages = ({ res, hide, lexThreadCount }) => {
  const { agentAvailable } = useSelector(store => store.lexClient);
  const dispatch = useDispatch();
  return (
    <>
      {res.message && <>
        <div className='bp-md:w--90 p-10'>
          <BotMessage>
            <Markdown linkTarget="_blank">{res.message}</Markdown>
          </BotMessage>
        </div>
        {!agentAvailable && lexThreadCount > 2 && !hide && <FeedbackSection>
          <img src={thumpsup} alt="logo" onClick={() => dispatch(leXTextCall('Thumbs up'))} />
          <img src={thumpsdown} alt="logo" onClick={() => dispatch(leXTextCall('Thumbs down'))} />
        </FeedbackSection>}
      </>
      }
    </>
  )
}


RenderMessages.propTypes = {
  res: PropTypes.any,
  hide: PropTypes.bool,
  lexThreadCount: PropTypes.number
}

export default function ChatMessagesLayout() {
  const { lexThread, chatEnded } = useSelector(store => store.lexClient);
  const { isChatEnded, message } = chatEnded
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const scrollToBottom = () => messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [lexThread]);

  const lexThreadCount = lexThread.length;
  const disablePrevious = (index) => (lexThreadCount !== 1 && (lexThreadCount - 1) !== index)
  return (
    <>
      {lexThread.map((res, index) =>
        res.type === 'bot' ? (
          <div key={index}>
            <RenderMessages res={res} hide={disablePrevious(index)} lexThreadCount={lexThreadCount} />
            <ButtonWrapper className='flex'>
              {res.buttons?.map(btn => (
                <Button
                  disabled={isChatEnded || disablePrevious(index)}
                  key={btn.text}
                  label={btn.text}
                  onClick={() => dispatch(botButtonAction(btn))}
                />
              ))}
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
