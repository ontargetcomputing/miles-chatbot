export class Util {
    static getPropsFromArray(props, array, hasFetchFromLast = true, index = 0) {
        if (array?.length) {
            if (hasFetchFromLast) {
                return array[array.length - 1][props];
            }
            return array[index][props];
        }
        return null;
    }

    static getCreateCasePayload(lexThread, language, buttonText) {
        let livechat = lexThread?.sessionAttributes?.livechat;
        if (livechat) {
            livechat = JSON.parse(livechat);
            const payload = {
                firstname: livechat.firstname.FreeText,
                lastname: livechat.lastname.FreeText,
                email: livechat.emailaddress.FreeText,
                language,
                phonenumber: livechat.phonenumber.FreeText,
                casedescription: buttonText,
                casesubject: 'Chatbot Inquiry'
            }

            return payload;
        }
        return null;
    }
}