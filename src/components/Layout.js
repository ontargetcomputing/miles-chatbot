import styled from 'styled-components'
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import ChatInput from './ChatInput'
import { useSelector } from 'react-redux'
import { ACTION_TYPE } from '../helper/enum'
import ChangeLanguage from './ChangeLanguage'
import ChatMessagesLayout from './ChatMessagesLayout'
import { leXTextCall } from '../connectors/lexClient'

const QID_WELCOM = "QID::Welcome";
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
  const dispatch = useDispatch();
  const { actionType, lexThread } = useSelector(store => store.lexClient);

  useEffect(() => {
    const topicChanged = lexThread.length && lexThread[lexThread.length - 1]?.topic === 'language.changed';
    topicChanged && dispatch(leXTextCall(QID_WELCOM));
  }, [lexThread])

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
