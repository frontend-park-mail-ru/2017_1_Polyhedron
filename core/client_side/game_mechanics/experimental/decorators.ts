'use strict';

import {ConfigContext, ServiceContext} from "./context";
import {loadDataSources} from '../loaders/dataSourceLoader';
import {NamedConstructible} from "./interfaces";


function getClassConfigName<T extends NamedConstructible>(constructor: T) {
    return constructor.name + '.config';
}


function getSubObj(obj: {}, keys: string[]) {
    return keys.reduce((subObj, key) => subObj[key], obj);
}


export function Service<T extends NamedConstructible>(constructor: T) {
    return class extends constructor {
        public toString() {
            return constructor.name;
        }
    };
}


export function Autowired(constructFunc: NamedConstructible, ...args: any[]) {
    loadDataSources();

    const context = ServiceContext.getInstance();
    context.set(constructFunc.name, new constructFunc(...args));

    return (target: any, key: string) => {
        target[key] = context.get(constructFunc.name);
    };
}


export function Load(url: string) {
    loadDataSources();

    const context = ConfigContext.getInstance();

    return (target: any, key: string) => {
        if (!target[key]) {
            const [head, ...tail] = url.split('/');
            const subConf = context.get(head);
            const val = getSubObj(subConf, tail);

            if (val) {
                target[key] = val;
            } else {
                throw Error("Requested non-existing object with URL " + url);
            }
        }
    };
}

