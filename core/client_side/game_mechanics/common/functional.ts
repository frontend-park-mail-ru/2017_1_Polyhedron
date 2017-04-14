'use strict';

export function join(...objects: {}[]) {
    return objects.reduce((result, object) => {
        Object.keys(object).forEach(key => result[key] = object[key]);
        return result;
    }, {});
}


