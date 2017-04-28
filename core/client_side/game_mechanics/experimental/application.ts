'use strict';
import {Constructible} from "./interfaces";
import {loadServices} from "../loaders/serviceLoader";

export function Application() {
    loadServices();

    return <T extends Constructible> (constructor: T) => {
        return constructor;
    };
}
