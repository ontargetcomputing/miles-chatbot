import styled from 'styled-components'
import ChatInput from './ChatInput'
import Button from './Button'
import BotMessage from './BotMessage'
import { useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { useDispatch } from 'react-redux'
import { searchQuery } from '../connectors/lexClient'
import UserMessage from './UserMessage'
import React, { useEffect, useRef } from 'react'

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 216px);
  @media (max-width: 600px) {
    height:calc(100% - 196px);
  }
  @media (max-width: 280px) {
    height:calc(100% - 196px);
  }  
}
`
function Layout() {
  const messagesEndRef = useRef(null)
  const dispatch = useDispatch()
  const { lexThread } = useSelector(store => store.lexClient)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [lexThread]);
  return (
    <>
      <LayoutWrapper>
        {lexThread.map((res, index) =>
          res.type === 'bot' ? (
            <div key={index}>
              <div className='bp-md:w--90 p-10'>
                <BotMessage>
                  <Markdown>{res.message}</Markdown>
                </BotMessage>
              </div>
              <div className='flex'>
                {res.buttons?.map(btn => (
                  <Button
                    key={btn.text}
                    label={btn.text}
                    onClick={() => dispatch(searchQuery(btn.value))}
                  />
                ))}
              </div>
            </div>
          ) : (
            <UserMessage key={index}>{res.message}</UserMessage>
          )
        )}
           <div ref={messagesEndRef} />
      </LayoutWrapper>
      <ChatInput />
    </>
  )
}

export default Layout
