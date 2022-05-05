/* eslint-disable complexity */
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
import { agentAvailable, resetIdleTimer } from "../ducks/lexClient"
import { Loading } from '@ca-dmv/core';

const LayoutWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height:calc(100% - 131px);  
  &.cb-full-height{
    height:calc(100% - 131px); 
  }
}`

function Layout() {
  const dispatch = useDispatch()
  const { actionType, lexThread, chatEnded, searchTerm, isLoading, isAgentTyping } = useSelector((store) => store.lexClient)
  const { isChatEnded } = chatEnded
  const checkActionType = actionType === ACTION_TYPE.LANGUAGES
  const isVisibleChatInput = !checkActionType && !isChatEnded
  const isShowLoading=isLoading||isAgentTyping;
  useEffect(() => {
    const topicChanged = Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread) === TOPIC.LANGUAGE_CHANGED
    const liveChatTopic = Util.getPropsFromArray(LEXTHREAD_PROPS.TOPIC, lexThread) === 'liveChatStatus.starting'

    if (topicChanged) {
      dispatch(leXTextCall(searchTerm))
    } else if (liveChatTopic) {
      dispatch(agentAvailable(true))
    }
    dispatch(resetIdleTimer());
  }, [lexThread])
  return (
    <>
      <IdleTime idleTimeInSeconds={600} warnTimeInSeconds={60} />
      <LayoutWrapper className={isLoading ? "cb-disabled" : ""}>
        {checkActionType ? <ChangeLanguage /> : <ChatMessagesLayout />}
        {isShowLoading&& <Loading loadingText={isAgentTyping?"Agent is typing...": "Loading..."}/>}
      </LayoutWrapper>

      {isVisibleChatInput && <ChatInput />}
    </>
  )
}

export default Layout
