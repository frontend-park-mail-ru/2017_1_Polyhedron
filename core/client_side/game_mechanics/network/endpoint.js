
import * as events from '../common/events';

const REQUEST_TYPES = {
    roomRequest: "roomRequest",
    gameStart: "gameStart",
    stateUpdate: "stateUpdate"
};

const DEFAULT_URL = "ws://localhost:8081";


export class WSEndpoint {
    constructor(url) {
        this._url = url || DEFAULT_URL;
        this._socket = new WebSocket(this._url);
        this._initSocket();
        this._setListeners();
    }

    requestRoom() {
        this.sendMessage(REQUEST_TYPES.roomRequest);
    }

    submitGameStart() {
        this.sendMessage(REQUEST_TYPES.gameStart);
    }

    sendMessage(messageType, data) {
        this._send(
            this._getRequestJson(messageType, data)
        );
    }

    close() {
        this._socket.close();
    }

    _initSocket() {
        this._socket.onmessage = event => {
            window.dispatchEvent(events.ServerMessageEvent.create(JSON.parse(event.data)));
        };

        this._socket.onclose = () => {
            window.dispatchEvent(events.ConnectionClosedEvent.create());
        };

        this._socket.onerror = event => {
            window.dispatchEvent(events.ServerErrorEvent.create(event.data));
        };
    }

    _setListeners() {
        window.addEventListener(events.ClientMessageEvent.eventName, event => {
            let detail = event.detail;
            this.sendMessage(detail.type, detail.data);
        });
    }

    _getRequestJson(type, data) {
        return JSON.stringify({
            requestType: type,
            data: data
        });
    }

    _send(data) {
        this._socket.send(data);
    }

}
