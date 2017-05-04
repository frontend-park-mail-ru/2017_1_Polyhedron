"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    renderAndSave(url, options) {
        this.render(url, options)
            .then(() => this._saveChange(url, options))
            .catch(err => {
            console.error(err);
            this.renderAndSave('404');
        });
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