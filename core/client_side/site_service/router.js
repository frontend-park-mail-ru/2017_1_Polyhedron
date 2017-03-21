
export class Router {
    constructor(viewMap) {
        this._viewMap = viewMap || {};
    }

    register(url, view) {
        this._viewMap[url] = view;
    }

    unregister(url) {
        let viewWrapper = this._viewMap[url];
        this._viewMap[url] = undefined;
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
        for (let urlPattern in this._viewMap) {
            if (url.match(urlPattern)) {
                return this._viewMap[urlPattern];
            }
        }
    }

    _saveChange(url, options) {
        options = options || {};
        options.url = url;
        window.history.pushState(options, url, url);
    }
}

