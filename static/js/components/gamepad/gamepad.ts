'use strict';

import * as renderGamepad from '../../templates/render_gamepad';
import {Autowired} from "../../../../core/client_side/game_mechanics/experimental/decorators";
import {EventBus} from "../../../../core/client_side/game_mechanics/event_system/event_bus";
import {controllerEvents} from "../../../../core/client_side/game_mechanics/event_system/events";
import ArrowDirectionEvent = controllerEvents.ArrowDirectionEvent;

export class Gamepad {
    public controlLeft;
    public controlUp;
    public controlRight;
    public controlDown;
    private template: (options: {}) => string;
    private element;

    @Autowired(EventBus)
    private eventBus;

    constructor(options) {
        this.template = renderGamepad.template;
    }

    public render(parent): void {
        parent.innerHTML = parent.innerHTML + this.template({});
        this.element = parent.querySelector('.controls');
        this.controlLeft = this.element.children[0];
        this.controlUp = this.element.children[1];
        this.controlDown = this.element.children[2];
        this.controlRight = this.element.children[3];

        this.controlLeft.onpointerdown = () => {
            this.eventBus.dispatchEvent(ArrowDirectionEvent.create([-1, 0]));
        };

        this.controlRight.onpointerdown = () => {
            this.eventBus.dispatchEvent(ArrowDirectionEvent.create([1, 0]));
        };

        this.controlDown.onpointerdown = () => {
            this.eventBus.dispatchEvent(ArrowDirectionEvent.create([0, -1]));
        };

        this.controlUp.onpointerdown = () => {
            this.eventBus.dispatchEvent(ArrowDirectionEvent.create([0, 1]));
        };

        Array.from(this.element.children).forEach(
            child => (child as any).onpointerup = () => this.eventBus.dispatchEvent(ArrowDirectionEvent.create([0, 0]))
        );
    }
}
