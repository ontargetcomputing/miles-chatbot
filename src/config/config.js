export const CONFIG = {
    LIVE_AGENT: {
        ENDPOINT: process.env.REACT_APP_LIVE_AGENT_ENDPOINT,
        WAITING_FOR_AGENT_MESSAGE: "Thank you for waiting. An agent will be with you when available.",
        WAIT_NEXT_AVAILABLE_AGENT: "Thank you for contacting us. We have logged case number {0} for your inquiry.  Please wait for the next available agent.",
        LIVE_CHAT_CONNECTION: "Live Chat Connection Established",
        HAS_JOINED: "has joined",
        SALESFORCE_POLLING_INTERVAL: 2000
    }
}