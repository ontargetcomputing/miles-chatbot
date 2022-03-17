import styled from "styled-components"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import ChatInput from "./ChatInput"
import { useSelector } from "react-redux"
import { ACTION_TYPE, LEXTHREAD_PROPS, TOPIC } from "../helper/enum"
import ChangeLanguage from "./ChangeLanguage"
import ChatMessagesLayout from "./ChatMessagesLayout"
import { leXTextCall } from "../connectors/lexClient"
import IdleTime from "./Idle"
import { Util } from "../helper/Util"

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 196px);  
  &.cb-full-height{
    height:calc(100% - 131px); 
  }
}`

function Layout() {
  const dispatch = useDispatch()
  const { actionType, lexThread, chatEnded, searchTerm } = useSelector((store) => store.lexClient)
  const { isChatEnded } = chatEnded
  const checkActionType = actionType === ACTION_TYPE.LANGUAGES
  const isVisibleChatInput = !checkActionType && !isChatEnded

  useEffect(() => {
    // const topicChanged = lexThread.length && lexThread[lexThread.length - 1]?.topic === 'language.changed'
    const topicChanged = Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread) === TOPIC.LANGUAGE_CHANGED
    if (topicChanged) {
      dispatch(leXTextCall(searchTerm))
    }
  }, [lexThread])

  return (
    <>
      <IdleTime idleTimeInSeconds={600} warnTimeInSeconds={60} />
      <LayoutWrapper className={!isVisibleChatInput ? "cb-full-height" : ""}>
        {checkActionType ? <ChangeLanguage /> : <ChatMessagesLayout />}
      </LayoutWrapper>
      {isVisibleChatInput && <ChatInput />}
    </>
  )
}

export default Layout
