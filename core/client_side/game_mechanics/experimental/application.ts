'use strict';
import {Constructible} from "./interfaces";
import {loadServices} from "./loaders/serviceLoader";

export function Application () {
    console.log('Application');
    loadServices();

    return function<T extends Constructible> (constructor: T) {
        return constructor;
    }
}




