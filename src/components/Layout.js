import styled from 'styled-components'
import ChatInput from './ChatInput'
import Button from './Button'
import BotHeader from './BotHeader'
import BotMessage from './BotMessage'
import { useSelector } from 'react-redux'
import Markdown from 'react-markdown'
import { useDispatch } from 'react-redux'
import { searchQuery } from '../connectors/lexClient'

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
  const dispatch = useDispatch()
  const { lexResponse } = useSelector(store => store.lexClient)
  return (
    <>
      <LayoutWrapper>
        {lexResponse.map((res, index) =>
          res.type === 'bot' ? (
            <div key={index}>
              <BotHeader>Miles:</BotHeader>
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
            <div style={{ textAlign: 'right' }}>{res.message}</div>
          )
        )}
      </LayoutWrapper>
      <ChatInput />
    </>
  )
}

export default Layout
