'use strict';
import {Constructible} from "./interfaces";
import {loadServices} from "../loaders/serviceLoader";

export function Application(services) {
    loadServices(services);

    return <T extends Constructible> (constructor: T) => {
        return constructor;
    };
}
