
import Button from './Button'
import Markdown from 'react-markdown'
import BotMessage from './BotMessage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { searchQuery } from '../connectors/lexClient'
import UserMessage from './UserMessage'
import styled from 'styled-components'

const ButtonWrapper = styled.div`
margin-left: 12px;
`


export default function ChatMessagesLayout() {
  const { lexThread, isChatEnded } = useSelector(store => store.lexClient);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const scrollToBottom = () => messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [lexThread]);

  const lexThreadCount = lexThread.length;
  return (
    <>
      {lexThread.map((res, index) =>
        res.type === 'bot' ? (
          <div key={index}>
          {res.message && <div className='bp-md:w--90 p-10'>
            <BotMessage>
              <Markdown linkTarget="_blank">{res.message}</Markdown>
            </BotMessage>
          </div>}
            <ButtonWrapper className='flex'>
              {res.buttons?.map(btn => (
                <Button
                  disabled={isChatEnded || (lexThreadCount !== 1 && (lexThreadCount - 1) !== index)}
                  key={btn.text}
                  label={btn.text}
                  onClick={() => dispatch(searchQuery(btn.value))}
                />
              ))}
            </ButtonWrapper>
          </div>
        ) : (
          <UserMessage key={index}>{res.message}</UserMessage>
        )
      )}
      <div ref={messagesEndRef} />
    </>
  )
}
