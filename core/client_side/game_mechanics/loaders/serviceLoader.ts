'use strict';
import {services} from '../../configs/services';
import {Context} from "../experimental/context";
import {NamedConstructible} from "../experimental/interfaces";

export const loadServices = (() => {
    let loaded = false;
    return () => {
        if (!loaded) {
            const locator = Context.getInstance();

            services.forEach(<T extends NamedConstructible> (service: T) => {
                locator.addService((service as any).__proto__.name, new service());
            });

            loaded = true;
        }
    };
})();
