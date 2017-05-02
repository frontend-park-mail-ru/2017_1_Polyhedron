
import * as events from '../event_system/events';
import {Load, Autowired} from "../experimental/decorators";
import {EventBus} from "../event_system/event_bus";

const REQUEST_TYPES = {
    roomRequest: "roomRequest",
    gameStart: "gameStart",
    stateUpdate: "stateUpdate"
};

export class WSEndpoint {
    private _socket: WebSocket;

    @Load('network/wsUrl')
    private _url: string;

    @Autowired(EventBus)
    private _eventBus: EventBus;

    private static _getRequestJson(type, data) {
        return JSON.stringify({
            requestType: type,
            data
        });
    }

    constructor() {
        this._socket = new WebSocket(this._url);
        this._initSocket();
        this._setListeners();
    }

    public requestRoom() {
        this.sendMessage(REQUEST_TYPES.roomRequest);
    }

    public submitGameStart() {
        this.sendMessage(REQUEST_TYPES.gameStart);
    }

    public sendMessage(messageType, data = {}) {
        this._send(
            WSEndpoint._getRequestJson(messageType, data)
        );
    }

    public close() {
        this._socket.close();
    }

    private _initSocket() {
        this._socket.onmessage = event => {
            console.log(event.data);
            this._eventBus.dispatchEvent(events.networkEvents.ServerMessageEvent.create(JSON.parse(event.data)));
        };

        this._socket.onclose = () => {
            this._eventBus.dispatchEvent(events.networkEvents.ConnectionClosedEvent.create());
        };

        this._socket.onerror = (event: ErrorEvent) => {
            this._eventBus.dispatchEvent(events.networkEvents.ServerErrorEvent.create(event.error));
        };
    }

    private _setListeners() {
        this._eventBus.addEventListener(events.networkEvents.ClientMessageEvent.eventName, event => {
            const detail = event.detail;
            this.sendMessage(detail.type, detail.data);
        });
    }

    private _send(data) {
        this._socket.send(data);
    }

}
