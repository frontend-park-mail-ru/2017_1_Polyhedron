
export class Router {
    constructor(viewMap, defaultView) {
        this._viewMap = viewMap || {};
        this._defaultView = defaultView;
    }

    register(url, view) {
        this._viewMap[url] = view;
    }

    unregister(url) {
        let viewWrapper = this._viewMap[url];
        this._viewMap[url] = null;
        return viewWrapper;
    }

    render(url, options) {
        let view = this._getViewByURL(url);
        if (view) {
            view.render(options);
        }
    }

    renderAndSave(url, options) {
        this._saveChange(url, options);
        this.render(url, options);
    }

    _getViewByURL(url) {
        let view = this._viewMap[
            Object.keys(this._viewMap).find(urlPattern => url.match(urlPattern))
            ];

        return view ? view : this._defaultView;
    }

    _saveChange(url, options) {
        options = options || {};
        options.url = url;
        window.history.pushState(options, url, url);
    }
}

