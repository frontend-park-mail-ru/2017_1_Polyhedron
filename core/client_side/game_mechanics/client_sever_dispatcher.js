
import * as events from './events';


export class ClientServerDispatcher {
    constructor() {
        this._setListeners();
    }

    _setListeners() {
        document.addEventListener(events.PlatformMovedEvent.eventName, event => this.handlePlatformMovedEvent(event));
    }

    emitDefeatEvent(sectorIndex) {
        window.dispatchEvent(events.DefeatEvent.create(sectorIndex));
    }

    emitCorrectionEvent(ballPosition) {
        window.dispatchEvent(events.BallPositionCorrectionEvent.create(ballPosition));
    }

    handlePlatformMovedEvent(event) {
        console.log("Platform moved");
        console.log("Offset: ", event.detail);
    }
}
