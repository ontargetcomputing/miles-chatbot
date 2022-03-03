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
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 196px);  
  &.cb-full-height{
    height:calc(100% - 131px); 
  }
}`;

function Layout() {
  const dispatch = useDispatch();
  const { actionType, lexThread, isChatEnded } = useSelector(store => store.lexClient);
  const checkActionType = actionType === ACTION_TYPE.LANGUAGES;
  const isVisibleChatInput = !checkActionType && !isChatEnded;
  useEffect(() => {
    if (lexThread && lexThread.length) {
      const topic = lexThread[lexThread.length - 1].topic || "";

      if (topic) {
        dispatch(leXTextCall(QID_WELCOM));
      }
    }
  }, [lexThread])

  return (
    <>
      <LayoutWrapper className={!isVisibleChatInput ? "cb-full-height" : ""}>
        {checkActionType ? <ChangeLanguage /> : <ChatMessagesLayout />}
      </LayoutWrapper>
      {isVisibleChatInput && <ChatInput />}
    </>
  )
}

export default Layout
