'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../game_mechanics/experimental/decorators");
const event_bus_1 = require("../game_mechanics/event_system/event_bus");
const events_1 = require("../game_mechanics/event_system/events");
var RenderPageEvent = events_1.serviceEvents.RenderPageEvent;
class Router {
    constructor(viewMap, defaultView) {
        this._viewMap = viewMap || {};
        this._defaultView = defaultView;
        this._currView = null;
        this.eventBus.addEventListener(RenderPageEvent.eventName, event => {
            const url = event.detail.url;
            const options = event.detail.options;
            this.render(url, options);
        });
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
__decorate([
    decorators_1.Autowired(event_bus_1.EventBus)
], Router.prototype, "eventBus", void 0);
exports.Router = Router;
//# sourceMappingURL=router.js.map