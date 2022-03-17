export class InputUtil {
    static isRequired(data) {
        if (data && data.length) {
            return true;
        }
        return false;
    }

    static isValidPhone(data, maxLength = 10) {
        const regExp = RegExp(/^\d*/)
        if (data && data.length === maxLength && regExp.test(data)) {
            return true;
        }
        return false;
    }

    static isValidEmail(data) {
        const regExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)

        if (data) {
            return regExp.test(data)
        }
        return false;
    }
}