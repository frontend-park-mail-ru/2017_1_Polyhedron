'use strict';
import {Context} from "./context";


interface NamedConstructorFunc {
    new(...args: any[]):{};
    name?: string;
}


interface Constructible {
    new(...args: any[]):{};
}


function getClassConfigName<T extends NamedConstructorFunc> (constructor: T) {
    return constructor.name + '.config';
}


export function Service<T extends NamedConstructorFunc> (constructor: T) {
    return class extends constructor {
        toString() {
            return constructor.name;
        }
    }
}


export function Autowired(constructFunc) {
    const locator = Context.getInstance();
    if (!locator.contains(String(constructFunc))) {
        locator.add(constructFunc.name, new constructFunc());
    }

    return (target: any, key: string) => {
        target[key] = locator.getService(constructFunc.name);
    }
}


export function Configurable(config, path?: string) {
    const pathItems: string[] = path ? path.split('/') : [];
    const localConfig = pathItems.reduce((subConfig, key) => subConfig[key], config);

    return function<T extends NamedConstructorFunc> (constructor: T) {
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

/*
export function Initializable<T extends Constructible> (constructor: T) {
    console.log('Initializable called');
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            constructor.prototype.init();
        }
    };
}
*/


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
