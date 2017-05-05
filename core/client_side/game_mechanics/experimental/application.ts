'use strict';

import {Constructible} from "./interfaces";
import {loadServices} from "../loaders/serviceLoader";

export function Application(services) {
    return <T extends Constructible> (cons: T) => {
        return class extends cons {
            constructor(...args) {
                loadServices(services);
                super(...args);
            }
        };
    };
}
