
import * as events from '../event_system/events';


export class GameEventDispatcher {
    constructor() {
        this._setListeners();
    }

    _setListeners() {
        window.addEventListener(events.PlatformMovedEvent.eventName, event => this.handlePlatformMovedEvent(event));

        window.addEventListener(events.ServerMessageEvent.eventName, event => {
            let detail = event.detail;
            let gameEventClass = detail.type;
            let data = detail.data;

            try {
                window.dispatchEvent(events[gameEventClass].create(data));
            } catch (error) {
                console.error(error);
            }
        });
    }

    handlePlatformMovedEvent(event) {
        window.dispatchEvent(events.ClientMessageEvent.create({
            type: events.PlatformMovedEvent.eventName,
            data: event.detail
        }));
    }

}
