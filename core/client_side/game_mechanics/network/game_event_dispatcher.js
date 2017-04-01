
import * as events from '../common/events';


export class ClientServerDispatcher {
    constructor() {
        this._setListeners();
    }

    _setListeners() {
        window.addEventListener(events.PlatformMovedEvent.eventName, event => this.handlePlatformMovedEvent(event));

        window.addEventListener(events.ServerMessageEvent.eventName, event => {
            let details = event.detail;
            let gameEventClass = details.type;
            let data = details.data;

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
