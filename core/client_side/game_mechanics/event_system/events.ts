'use strict';

/**
 * NEVER create instances of BaseEvent class or its children with new.
 * If you try to create an instance of EventClass: EventClass extends BaseEvent, ALWAYS use EventClass.create(...).
 */
export abstract class BaseEvent {
    public static get eventName() {
        return (this as any).name;
    }

    public static create(eventDetail = {}) {
        return new CustomEvent(this.eventName, {
            detail: eventDetail,
        });
    }

    constructor() {
        const className = this.constructor.name;
        throw new Error(
            'NEVER create instances of ' +
            className +
            ' with new. ALWAYS use ' +
            className +
            '.create(...).');
    }
}


export namespace networkEvents {
    export class ServerErrorEvent extends BaseEvent {}


    export class ServerMessageEvent extends BaseEvent {}


    export class ClientMessageEvent extends BaseEvent {}


    export class ConnectionClosedEvent extends BaseEvent {}


    export class WorldUpdateEvent extends BaseEvent {
        public static create(eventDetail) {
            const detail = {
                platformsUpdate: [],

                ballUpdate: {}
            };

            detail.platformsUpdate = eventDetail.platformsUpdate.map(
                platformUpdate => {
                    return {
                        index: platformUpdate.index - eventDetail.playerIndex,
                        position: platformUpdate.position
                    };
                }
            );

            detail.ballUpdate = eventDetail.ballUpdate;

            return new CustomEvent(this.eventName, {detail});
        }
    }


    export class DefeatEvent extends BaseEvent {
        public static create(eventDetail) {
            const playerIndex = eventDetail.playerIndex;
            const looserIndex = eventDetail.looserIndex;

            return new CustomEvent(this.eventName, {
                detail: looserIndex - playerIndex
            });
        }
    }
}


export namespace gameEvents {
    export class PlatformMovedEvent extends BaseEvent {}


    export class ClientDefeatEvent extends BaseEvent {}


    export class BallBounced extends BaseEvent {}
}


export namespace controllerEvents {
    export class ArrowDirectionEvent extends BaseEvent {}
}
