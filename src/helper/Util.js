/* eslint-disable no-useless-escape */
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

    static parseCreateCaseResponse(response) {
        let data = null;
        if (response.length) {
            const { actionName, isSuccess, outputValues } = response[0];
            data = { actionName, isSuccess }

            if (outputValues) {
                const { var_CaseId: caseId, var_CaseNumber: caseNumber, var_Contact: contact } = outputValues;

                data = { ...data, caseId, caseNumber, contact }
            }
        }

        return data;
    }

    static stringFormat(data, ...args) {
        return data.replace(/{([0-9]+)}/g, function (match, index) {
            return typeof args[index] === 'undefined' ? match : args[index];
        });
    }
}




export const convertLinks = (text) => {
    const regex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, 'sg');
    let cookedText = text.replace(/~!/g, '[').replace(/!~/g, ']')
    let m;
    while ((m = regex.exec(cookedText)) !== null) {
      cookedText = cookedText.replace(m[0], `(${m[0]})`)
    }
    return cookedText
  }