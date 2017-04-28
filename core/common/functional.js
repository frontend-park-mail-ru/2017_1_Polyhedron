'use strict';

export function join(...objects) {
    return objects.reduce((result, object) => {
        Object.keys(object).forEach(key => result[key] = object[key]);
        return result;
    }, {});
}


export function flatten([head, ...tail]) {
    return head.concat(...tail)
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


