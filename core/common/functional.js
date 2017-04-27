'use strict';

export function join(...objects) {
    return objects.reduce((result, object) => {
        Object.keys(object).forEach(key => result[key] = object[key]);
        return result;
    }, {});
}


export transform(func, ...options) {
    return (prev, curr, ind, array) => {
        if (ind !== array.length) {
            return null;
        } else {
            return func(array, ...options);
        }
    }
}


