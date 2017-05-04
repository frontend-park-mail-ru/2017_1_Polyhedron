
export class Router {
    private _viewMap: any;
    private _defaultView: any;
    private _currView: any;

    constructor(viewMap, defaultView) {
        this._viewMap = viewMap || {};
        this._defaultView = defaultView;
        this._currView = null;
    }

    public register(url, view) {
        this._viewMap[url] = view;
    }

    public unregister(url) {
        const viewWrapper = this._viewMap[url];
        this._viewMap[url] = null;
        return viewWrapper;
    }

    public async render(url, options) {
        const view = this._getViewByURL(url);

        if (this._currView) {
            this._currView.reset();
        }
        return view.render(options)
            .then(() => {
                this._currView = view;
                return;
            })
            .catch((err) => {
                throw err;
            });
    }

    public renderAndSave(url, options?) {
        this.render(url, options)
            .then(() => this._saveChange(url, options))
            .catch(err => {
                console.error(err);
                this.renderAndSave('404');
            });

    }

    private _getViewByURL(url) {
        const view = this._viewMap[
            Object.keys(this._viewMap).find(urlPattern => url.match(urlPattern))
            ];

        return view ? view : this._defaultView;
    }

    private _saveChange(url, options) {
        options = options || {};
        options.url = url;
        window.history.pushState(options, url, url);
    }
}

