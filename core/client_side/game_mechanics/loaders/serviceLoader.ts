'use strict';
import {services} from '../../configs/services';
import {ServiceContext} from "../experimental/context";
import {NamedConstructible} from "../experimental/interfaces";

export const loadServices = (() => {
    let loaded = false;
    return () => {
        if (!loaded) {
            const context = ServiceContext.getInstance();

            services.forEach(<T extends NamedConstructible> (service: T) => {
                context.set((service as any).__proto__.name, new service());
            });

            loaded = true;
        }
    };
})();
