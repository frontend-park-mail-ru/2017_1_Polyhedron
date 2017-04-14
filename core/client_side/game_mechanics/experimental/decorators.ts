'use strict';
import {Context} from "./context";
import NamedConstructible = interfaces.NamedConstructible;
import ServiceConstructionData = interfaces.ServiceConstructionData;
import Constructible = interfaces.Constructible;

namespace interfaces {
    export interface NamedConstructible {
        new(...args: any[]):{};
        name?: string;
    }


    export interface Constructible {
        new(...args: any[]):{};
    }


    export interface ServiceConstructionData {
        cls: NamedConstructible;
        args?: any[];
    }
}


function getClassConfigName<T extends interfaces.NamedConstructible> (constructor: T) {
    return constructor.name + '.config';
}


export function Service<T extends NamedConstructible> (constructor: T) {
    return class extends constructor {
        toString() {
            return constructor.name;
        }
    }
}


export function Autowired(constructFunc: NamedConstructible, ...args: any[]) {
    const locator = Context.getInstance();
    if (!locator.contains(String(constructFunc))) {
        locator.add(constructFunc.name, new constructFunc(...args));
    }

    return (target: any, key: string) => {
        target[key] = locator.getService(constructFunc.name);
    }
}


export function Configurable(config, path?: string) {
    const pathItems: string[] = path ? path.split('/') : [];
    const localConfig = pathItems.reduce((subConfig, key) => subConfig[key], config);

    return function<T extends NamedConstructible> (constructor: T) {
        const locator = Context.getInstance();
        const configName = getClassConfigName(constructor);
        if (!locator.contains(configName)) {
            locator.add(configName, localConfig);
        }

        return class extends constructor {
            private config;

            constructor(...args: any[]) {
                super(...args);
                this.config = locator.getService(configName);
            }
        }
    }
}


export function FromConfig(name?: string) {
    const locator = Context.getInstance();

    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (!target[key]) {
            descriptor.get = () => {
                const config = locator.getService(getClassConfigName(target.constructor));
                const propName = name || key;
                return config[propName];

                //target[key] = config[propName];
            }

        }
    }
}


export function Application (registrationList: ServiceConstructionData[]) {
    const locator = Context.getInstance();

    registrationList.forEach(consData => {
        locator.add(consData.cls.name, new consData.cls(...consData.args));
    });

    return function<T extends Constructible> (constructor: T) {
        return constructor;
    }
}
