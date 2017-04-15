'use strict';
import * as dataSources from "../configs/dataSources";
import {Context} from "../experimental/context";

export const loadDataSources = (function() {
    let loaded = false;
    return () => {
        if (!loaded) {
            const locator = Context.getInstance();

            Object.keys(dataSources.config.dataSources).forEach(key => locator.addDataSource(key, dataSources.config.dataSources[key]));
            loaded = true;
        }
    }
})();

