export const ACTION_TYPE = {
    DEFAULT: "Default",
    SAVE_CHAT: "Save Chat",
    LANGUAGES: "Language",
    END_CHAT: "End Chat",
    UPDATE_LANGUAGE_PROVIDER: "Update language provider",
    SELECT_LANGUAGE: "Select Language"
}

export const LEXTHREAD_PROPS = {
    TOPIC: "topic"
}

export const TOPIC = {
    LANGUAGE_CHANGED: "language.changed",
    FIRST_NAME: "liveChat.firstname",
    LAST_NAME: "liveChat.lastname",
    EMAIL: "liveChat.emailaddress",
    PHONE_NUMBER: "liveChat.phonenumber",
    ENTERING_TOPIC: "liveChatStatus.enteringTopic",
    STARTING: "liveChatStatus.starting"
}

export const BOT_TYPE = {
    HUMAN: 'human',
    AGENT: 'agent',
    BOT: 'bot'
}

export const LIVECHAT_STATUS = {
    STARTING: "starting",
    REQUESTED: "requested",
    INITIALIZING: "initializing",
    ENTERING_TOPIC: "entering_topic",
    CREATING_CASE: "creating_case",
    CONNECTING: "connecting",
    ESTABLISHED: "established",
    DISCONNECTED: "disconnected",
    ENDED: "ended"
};

export const END_CHAT_MESSAGES = {
    AFTER_CONNECTION: 'Session Ended',
    END_CHAT: `You've ended the Chat.`,
    END_CHAT_TIMEOUT: `Your chat timed out because you didn't respond to the agent. If you'd like more help, please start a new chat.`
}

export const FEEDBACK_TYPE = {
    THUMBS_UP: "Thumbs up",
    THUMBS_DOWN: "Thumbs down"
}

export const SEARCH_QUERY = {
    WELCOME: "QID::Welcome"
}
