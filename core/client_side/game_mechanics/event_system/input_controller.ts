'use strict';
import {EventBus} from "./event_bus";
import * as events from "./events";
import {Service, Autowired} from "../experimental/decorators";

const KEY_LEFT = 39;
const KEY_RIGHT = 37;
const KEY_UP = 38;
const KEY_DOWN = 40;

@Service
export class InputController {
    @Autowired(EventBus)
    private eventBus;

    private _leftPressed: boolean;
    private _rightPressed: boolean;
    private _upPressed: boolean;
    private _downPressed: boolean;

    private _direction: number[] = [0, 0];

    constructor() {
        this._setListeners();
    }

    _setListeners() {
        document.addEventListener("keydown", event => {
            this._handleKeyDown(event);
            this.eventBus.dispatchEvent(events.controllerEvents.ArrowDirectionEvent.create(this._direction));
        });

        document.addEventListener("keyup", event => {
            this._handleKeyUp(event);
            this.eventBus.dispatchEvent(events.controllerEvents.ArrowDirectionEvent.create(this._direction));
        });
    }

    _handleKeyDown(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = true;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = true;
        } else if (event.keyCode == KEY_DOWN) {
            this._downPressed = true;
        } else if (event.keyCode == KEY_UP) {
            this._upPressed = true;
        }

        this._updatePlatformVelocityDirection();
    }

    _handleKeyUp(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = false;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = false;
        } else if (event.keyCode == KEY_DOWN) {
            this._downPressed = false;
        } else if (event.keyCode == KEY_UP) {
            this._upPressed = false;
        }
        this._updatePlatformVelocityDirection();
    }

    _updatePlatformVelocityDirection() {
        return this._direction = [this._getPlatformHorDirection(), this._getPlatformVertDirection()];
    }

    _getPlatformHorDirection() {
        if (!this._leftPressed && !this._rightPressed) {
            return 0;
        } else if (this._leftPressed && !this._rightPressed) {
            return -1;
        } else if (!this._leftPressed && this._rightPressed) {
            return 1;
        } else {
            return 0;
        }
    }

    _getPlatformVertDirection() {
        if (!this._downPressed && !this._upPressed) {
            return 0;
        } else if (this._downPressed && !this._upPressed) {
            return -1;
        } else if (!this._downPressed && this._upPressed) {
            return 1;
        } else {
            return 0;
        }
    }
}
