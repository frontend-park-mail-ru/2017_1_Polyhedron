'use strict';
import * as dataSources from "../../configs/dataSources";
import {ConfigContext} from "../experimental/context";


export const loadDataSources = (() => {
    let loaded = false;
    return () => {
        if (!loaded) {
            const context = ConfigContext.getInstance();

            Object.keys(dataSources.config.dataSources).forEach(key => context.set(key, dataSources.config.dataSources[key]));
            loaded = true;
        }
    };
})();

