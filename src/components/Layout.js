import styled from 'styled-components'
import ChatInput from './ChatInput'
import { useSelector } from 'react-redux'
import { ACTION_TYPE } from '../helper/enum'
import ChangeLanguage from './ChangeLanguage'
import ChatMessagesLayout from './ChatMessagesLayout'

const LayoutWrapper = styled.div`
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 196px);  

  &.cb-full-height{
    height:calc(100% - 131px); 
  }
}
`
function Layout() {
  const { actionType } = useSelector(store => store.lexClient);
  const checkActionType = actionType === ACTION_TYPE.LANGUAGES
  return (
    <>
      <LayoutWrapper className={checkActionType ? "cb-full-height" : ""}>
        {checkActionType ? <ChangeLanguage /> : <ChatMessagesLayout />}
      </LayoutWrapper>
      {!checkActionType && <ChatInput />}
    </>
  )
}

export default Layout
