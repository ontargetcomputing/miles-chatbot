import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageText } from './ChatMessagesLayout';
import { setActionType, setEndChat } from '../ducks/lexClient';
import Modal from './Modal';
import PropTypes from 'prop-types';
import { ACTION_TYPE } from '../helper/enum';

const message = `Your chat timed out because you didn't 
respond to the agent. If you'd like more help, 
please start a new chat.`

const IdleTime = ({ idleTimeInSeconds, warnTimeInSeconds }) => {
    const dispatch = useDispatch();
    const idleChatTimeout = idleTimeInSeconds * 1000;  // 30 sec
    const warnBefore = warnTimeInSeconds * 1000; // 19 sec
    const countDownDefaultValue = Math.trunc(warnBefore / 1000);

    const idleTimerRef = useRef();// 30sec
    const warnIntervalRef = useRef();

    const { resetIdleTime, chatEnded, actionType } = useSelector(store => store.lexClient);
    const { isChatEnded } = chatEnded;

    const [countDown, setCountDown] = useState(countDownDefaultValue); // should be in seconds
    const [showWarning, setShowWarning] = useState(false);
    const [active, setActive] = useState(true);

    useEffect(() => {
        startTimer();
        return () => {
            idleTimerRef.current && clearInterval(idleTimerRef.current);
            warnIntervalRef.current && clearInterval(warnIntervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (countDown <= 0) {
            clearAllTimer();
            setActive(false);
            setShowWarning(false);
            dispatch(setEndChat({ isChatEnded: true, message }));
            actionType === ACTION_TYPE.LANGUAGES && dispatch(setActionType(ACTION_TYPE.DEFAULT));
        }
    }, [countDown])

    useEffect(() => {
        startTimer();
    }, [resetIdleTime])

    const startTimer = () => {
        clearAllTimer();

        if (active && !isChatEnded) {
            const timeout = Math.trunc(idleChatTimeout - warnBefore);
            idleTimerRef.current = setTimeout(() => {
                warnIntervalRef.current = setInterval(() => setWarningDialog(), 1000);
            }, timeout);
        }
    }

    const setWarningDialog = () => {
        setShowWarning(true);
        setCountDown(prevCount => prevCount - 1);
    }

    const clearAllTimer = () => {
        idleTimerRef.current && clearInterval(idleTimerRef.current);
        warnIntervalRef.current && clearInterval(warnIntervalRef.current);
        setShowWarning(false);
        setCountDown(countDownDefaultValue)
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
