import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageText } from './ChatMessagesLayout';
import { setEndChat } from '../ducks/lexClient';
import Modal from './Modal';
import PropTypes from 'prop-types';

const message = `Your chat timed out because you didn't 
respond to the agent. If you'd like more help, 
please start a new chat.`

const IdleTime = ({ idleTimeInSeconds, warnTimeInSeconds }) => {
    const dispatch = useDispatch();
    const idleChatTimeout = idleTimeInSeconds * 1000;  // 30 sec
    const warnBefore = warnTimeInSeconds * 1000; // 19 sec
    const { resetIdleTime, chatEnded } = useSelector(store => store.lexClient);
    const { isChatEnded } = chatEnded;
    const [idleTimerRef, setIdleTimerRef] = useState(null);// 30sec
    const [warnIntervalRef, setWarnIntervalRef] = useState(null);
    const [countDown, setCountDown] = useState(Math.trunc(warnBefore / 1000)); // should be in seconds
    const [showWarning, setShowWarning] = useState(false);
    const [active, setActive] = useState(true);

    useEffect(() => {
        startTimer();
        window.idleTimerRefs = [];
        window.warnIntervalRefs = [];

    }, []);

    useEffect(() => {
        if (countDown <= 0) {
            clearAllTimer();
            setActive(false);
            dispatch(setEndChat({ isChatEnded: true, message }))
            setShowWarning(false);
            return;
        }
    }, [countDown])

    useEffect(() => {
        startTimer();
    }, [resetIdleTime])

    const startTimer = () => {
        clearAllTimer();

        if (active && !isChatEnded) {
            const timeout = Math.trunc(idleChatTimeout - warnBefore);
            const timeoutRef = setTimeout(() => {
                const intervalRef = setInterval(() => setWarningDialog(), 2000);
                setWarnIntervalRef(intervalRef);
                window.warnIntervalRefs.push(intervalRef);
            }, timeout);
            setIdleTimerRef(timeoutRef);
            window.idleTimerRefs.push(timeoutRef);
        }
    }

    const setWarningDialog = () => {
        setShowWarning(true);
        setCountDown(prevCount => prevCount - 1);
    }

    const clearAllTimer = () => {
        window.warnIntervalRefs && window.warnIntervalRefs.forEach(warn => clearInterval(warn));
        window.idleTimerRefs && window.idleTimerRefs.forEach(warn => clearInterval(warn));
        window.warnIntervalRefs = [];
        window.idleTimerRefs = [];

        warnIntervalRef && clearInterval(warnIntervalRef);
        idleTimerRef && clearInterval(idleTimerRef);
        setShowWarning(false);
        setIdleTimerRef(null);
        setWarnIntervalRef(null);
        setCountDown(Math.trunc(warnBefore / 1000))
    }

    const onClose = () => {
        startTimer();
    }

    return (
        <Modal show={showWarning} onClose={onClose}><div>
            <MessageText>Are you still there? Please respond winthin </MessageText>
            <MessageText>{countDown}s</MessageText>
            <MessageText>this chat will time out.</MessageText>
        </div></Modal>
    )
}

IdleTime.propTypes = {
    idleTimeInSeconds: PropTypes.number,
    warnTimeInSeconds: PropTypes.number
}

export default IdleTime;
