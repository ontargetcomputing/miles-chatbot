import React, { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { MessageText } from "./ChatMessagesLayout"
import { setActionType, setEndChat } from "../ducks/lexClient"
import { endChat } from '../connectors/lexClient'
import Modal from "./Modal"
import PropTypes from "prop-types"
import { ACTION_TYPE,  END_CHAT_MESSAGES } from "../helper/enum"
import { LIVECHAT_STATUS } from "../helper/enum"

// const message = `Your chat timed out because you didn't 
// respond to the agent. If you'd like more help, 
// please start a new chat.`

const IdleTime = ({ idleTimeInSeconds, warnTimeInSeconds }) => {
  const dispatch = useDispatch()
  const idleChatTimeout = idleTimeInSeconds * 1000 // 30 sec
  const warnBefore = warnTimeInSeconds * 1000 // 19 sec
  const countDownDefaultValue = Math.trunc(warnBefore / 1000)

  const idleTimerRef = useRef() // 30sec
  const warnIntervalRef = useRef()

  const { resetIdleTime, chatEnded, actionType, liveChat } = useSelector((store) => store.lexClient)
  const { isChatEnded } = chatEnded
  const { status } = liveChat

  const [countDown, setCountDown] = useState(countDownDefaultValue) // should be in seconds
  const [showWarning, setShowWarning] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    startTimer()
    return () => {
      idleTimerRef.current && clearInterval(idleTimerRef.current)
      warnIntervalRef.current && clearInterval(warnIntervalRef.current)
    }
  }, [])

  const endChatOnTimeout = () =>  dispatch(endChat())
  

  useEffect(() => {
    if (countDown <= 0) {
      clearAllTimer()
      setActive(false)
      setShowWarning(false)
      if(status === LIVECHAT_STATUS.ESTABLISHED || status === LIVECHAT_STATUS.CONNECTING){
        endChatOnTimeout()
      }
      dispatch(setEndChat({ isChatEnded: true, message: END_CHAT_MESSAGES.END_CHAT_TIMEOUT }))
      actionType === ACTION_TYPE.LANGUAGES && dispatch(setActionType(ACTION_TYPE.DEFAULT))
    }
  }, [countDown])

  useEffect(() => {
    startTimer()
  }, [resetIdleTime, isChatEnded])

  const startTimer = () => {
    clearAllTimer()

    if (active && !isChatEnded) {
      const timeout = Math.trunc(idleChatTimeout - warnBefore)
      idleTimerRef.current = setTimeout(() => {
        warnIntervalRef.current = setInterval(() => setWarningDialog(), 1000)
      }, timeout)
    }
  }

  const setWarningDialog = () => {
    setShowWarning(true)
    setCountDown((prevCount) => prevCount - 1)
  }

  const clearAllTimer = () => {
    idleTimerRef.current && clearInterval(idleTimerRef.current)
    warnIntervalRef.current && clearInterval(warnIntervalRef.current)
    setShowWarning(false)
    setCountDown(countDownDefaultValue)
  }

  const onClose = () => {
    startTimer()
  }

  return (
    <Modal show={showWarning} onClose={onClose}>
      <div>
        <MessageText>Are you still there? Please respond within </MessageText>
        <MessageText>{countDown}s</MessageText>
        <MessageText>or the chat will time out.</MessageText>
      </div>
    </Modal>
  )
}

IdleTime.propTypes = {
  idleTimeInSeconds: PropTypes.number,
  warnTimeInSeconds: PropTypes.number,
}

export default IdleTime
