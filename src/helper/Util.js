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
}