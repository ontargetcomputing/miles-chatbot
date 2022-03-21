import { CONFIG } from "../../config/config";
import { axiosWithRetry } from "./axios-wrapper";


export class ConstructPayload {
    static sessionPayload(session){
        session = {
                key: session.key,
                id: session.id,
                clientPollTimeout: session.clientPollTimeout,
                affinityToken: session.affinityToken
            }
        return session
    }

    static chatHistoryPayload(data){
        data = data.map(chat=>({
            text:chat.message,
            language:chat.language,
            type:chat.type
        }));
        return data
    }
}

const connectPayload = (session, chat_history, caseId, contactId, livechat_username) => {
session = ConstructPayload.sessionPayload(session)
chat_history = ConstructPayload.chatHistoryPayload(chat_history)
return { session, chat_history, caseId, contactId, livechat_username, user_agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0' }
}

export class AgentLiveService {
    async createCase(data) {
        try {
            const config = {
                method: 'post',
                url: `${CONFIG.LIVE_AGENT.ENDPOINT}/createCase`,
                data
            };

            return await axiosWithRetry(config);

        } catch (error) {
            return error
        }
    }

    async startSession() {
        const config = {
            method: 'post',
            url: `${CONFIG.LIVE_AGENT.ENDPOINT}/startSession`,
        };
        return await axiosWithRetry(config);
    }

    async connect(session, chat_history, caseId, contactId, livechat_username) {
        const data = JSON.stringify(connectPayload(session, chat_history, caseId, contactId, livechat_username))
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'post',
            url: `${CONFIG.LIVE_AGENT.ENDPOINT}/connect`,
            data
        };
        return await axiosWithRetry(config);
    }

    async getMessage(session) {
        const config = {
            method: 'post',
            url: `${CONFIG.LIVE_AGENT.ENDPOINT}/getMessage`,
            data: session,
        };
        return await axiosWithRetry(config);
    }

    async translator(targetLanguage, message) {
        const config = {
            method: 'post',
            url: `${CONFIG.LIVE_AGENT.ENDPOINT}/translate`,
            data: { targetLanguage, message },
        };

        return axiosWithRetry(config);
    }
}