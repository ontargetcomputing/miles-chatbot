import React, { useEffect, useState } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import { MessageText } from './ChatMessagesLayout';
import { setEndChat } from '../ducks/lexClient';
import Modal from './Modal';
import PropTypes from 'prop-types';


const message = `Your chat timed out because you didn't 
respond to the agent. If you'd like more help, 
please start a new chat.`



const IdleTime = ({ idleTimeInMinutes, warnTimeInMinutes }) => {
    const idleChatTimout = idleTimeInMinutes * 60 * 1000;  // 30 sec
    const warnBefore = warnTimeInMinutes * 60 * 1000; // 19 sec
    let warnTimeout; // 20sec
    let idleTimeout;// 30sec
    let lastMinutesInterval;
    const [countdown, setCountDown] = useState(Math.trunc(warnBefore / 1000)); // should be in seconds
    const dispatch = useDispatch();
    const [showWarning, setShowWarning] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { resetIdleTime, chatEnded } = useSelector(store => store.lexClient);
    const { isChatEnded } = chatEnded
 
    useEffect(() => !isChatEnded && resetTimer(), [resetIdleTime]);
    useEffect(() => {
        if (isActive && countdown > 0) {
            setShowWarning(true);
            lastMinutesInterval = setInterval(() => {
                setCountDown(countdown => countdown - 1); //0
          }, 1000);
        }
        return () => clearInterval(lastMinutesInterval);
      }, [isActive, countdown]);

      function toggle() {
        setIsActive(!isActive);
      }
    const startTimer = () => {
        warnTimeout = setTimeout(() => toggle(), idleChatTimout - warnBefore);
        idleTimeout = setTimeout(() => {
            setShowWarning(false); 
            dispatch( setEndChat({ isChatEnded: true,message}));
        }, idleChatTimout) // end chat 
    };

    const resetTimer = () => {
        // after 30 sec reset tim
        warnTimeout && clearTimeout(warnTimeout);
        idleTimeout && clearTimeout(idleTimeout);
        lastMinutesInterval && clearInterval(lastMinutesInterval);
        setCountDown(Math.trunc(warnBefore / 1000)); //19
        startTimer();
    };
    return (
        <Modal show={showWarning}><div>
        <MessageText>Are you still there? Please respond winthin </MessageText>
        <MessageText>{countdown}s</MessageText>
        <MessageText>this chat will time out.</MessageText>
    </div></Modal>
    )
}

IdleTime.propTypes = {
    idleTimeInMinutes: PropTypes.number,
    warnTimeInMinutes: PropTypes.number
}

export default IdleTime;
