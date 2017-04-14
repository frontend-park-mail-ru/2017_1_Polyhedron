
import * as events from '../event_system/events';

const REQUEST_TYPES = {
    roomRequest: "roomRequest",
    gameStart: "gameStart",
    stateUpdate: "stateUpdate"
};

const DEFAULT_URL = "ws://localhost:8081";


export class WSEndpoint {
    private _url: string;
    private _socket: WebSocket;

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

    sendMessage(messageType, data={}) {
        this._send(
            this._getRequestJson(messageType, data)
        );
    }

    close() {
        this._socket.close();
    }

    _initSocket() {
        this._socket.onmessage = event => {
            window.dispatchEvent(events.networkEvents.ServerMessageEvent.create(JSON.parse(event.data)));
        };

        this._socket.onclose = () => {
            window.dispatchEvent(events.networkEvents.ConnectionClosedEvent.create());
        };

        /*
        this._socket.onerror = event => {
            window.dispatchEvent(events.ServerErrorEvent.create(event.data));
        };
        */
        this._socket.onerror = function (event: ErrorEvent) {
            //window.dispatchEvent(events.ServerErrorEvent.create(event.data));
            window.dispatchEvent(events.networkEvents.ServerErrorEvent.create()); // TODO fix
        };
    }

    _setListeners() {
        window.addEventListener(events.networkEvents.ClientMessageEvent.eventName, function (event: CustomEvent) {
            const detail = event.detail;
            this.sendMessage(detail.type, detail.data)
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
