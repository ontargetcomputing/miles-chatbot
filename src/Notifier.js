import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BOT_TYPE } from "./helper/enum";

const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};

const Notifier = () => {
    const url = process.env.REACT_APP_ASSETS_URL ? true : false
    const soundPath = "/assets/miles-1.mp3";
    const notification = url ? `${process.env.REACT_APP_ASSETS_URL}${soundPath}` : `${soundPath}`
    const [, toggle] = useAudio(notification);
    const { lexThread } = useSelector(store => store.lexClient);
    // const [count, setCount] = useState(0);

    // const visibilitychanged = () => {
    //     if (document.visibilityState === 'visible') {
    //         console.log("doc visible")
    //         setCount(0);
    //         showCount(0);
    //     } else {
    //         console.log("doc not visible")
    //     }
    // }

    useEffect(() => {
        const humanType = lexThread.length && lexThread[lexThread.length - 1].type === BOT_TYPE.HUMAN;
        if (!humanType) {
            // setCount(count + 1);
            toggle();
            // showCount(count + 1)
        }
    }, [lexThread]);


    // const showCount = (notificationCount) => {
    //     const pattern = /^\(\d+\)/;

    //     if (pattern.test(document.title) || notificationCount === 0) {
    //         document.title = document.title.replace(pattern, notificationCount === 0 ? "" : `(${notificationCount})`);
    //     } else {
    //         document.title = `(${notificationCount}) ${document.title}`;
    //     }
    // }

    // useEffect(() => {
    //     document.addEventListener("visibilitychange", visibilitychanged);
    //     return () => {
    //         document.removeEventListener("visibilitychange", visibilitychanged);
    //     };
    // }, []);


    return (
        <div>

        </div>
    );
};

export default Notifier;