"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Router {
    constructor(viewMap, defaultView) {
        this._viewMap = viewMap || {};
        this._defaultView = defaultView;
        this._currView = null;
    }
    register(url, view) {
        this._viewMap[url] = view;
    }
    unregister(url) {
        const viewWrapper = this._viewMap[url];
        this._viewMap[url] = null;
        return viewWrapper;
    }
    render(url, options) {
        const view = this._getViewByURL(url);
        if (this._currView) {
            this._currView.reset();
        }
        view.render(options);
        this._currView = view;
    }
    renderAndSave(url, options) {
        this._saveChange(url, options);
        this.render(url, options);
    }
    _getViewByURL(url) {
        const view = this._viewMap[Object.keys(this._viewMap).find(urlPattern => url.match(urlPattern))];
        return view ? view : this._defaultView;
    }
    _saveChange(url, options) {
        options = options || {};
        options.url = url;
        window.history.pushState(options, url, url);
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map