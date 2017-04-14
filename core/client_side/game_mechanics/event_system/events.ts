/**
 * NEVER create instances of BaseEvent class with new. ALWAYS use classname.create(...).
 */
export abstract class BaseEvent {
    protected static _name: string;

    constructor() {
        throw new Error('NEVER create instances of BaseEvent class with new. ALWAYS use classname.create(...).');
    }

    static get eventName() {
        return this._name;
    }

    static create(eventDetail) {
        return new CustomEvent(this._name, {
            detail: eventDetail,
        });
    }
}


export class PlatformMovedEvent extends BaseEvent {}


export class BallPositionCorrectionEvent extends BaseEvent {}


export class DefeatEvent extends BaseEvent {
    static create(eventDetail) {
        const playerIndex = eventDetail.playerIndex;
        const looserIndex = eventDetail.looserIndex;

        return new CustomEvent(this._name, {
            detail: looserIndex - playerIndex
        });
    }
}


export class ClientDefeatEvent extends BaseEvent {}


export class EnemyPositionCorrectionEvent extends BaseEvent {
    static create(eventDetail) {
        const playerIndex = eventDetail.playerIndex;
        const enemyIndex = eventDetail.enemyIndex;
        const offset = eventDetail.offset;

        return new CustomEvent(this._name, {
            detail: {
                index: enemyIndex - playerIndex,
                offset: offset
            }
        });
    }
}


export class WorldUpdateEvent extends BaseEvent {
    static create(eventDetail) {
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

        return new CustomEvent(this._name, {
            detail: detail
        });
    }
}


export class ServerMessageEvent extends BaseEvent {}


export class ClientMessageEvent extends BaseEvent {}


export class ConnectionClosedEvent extends BaseEvent {}


export class ServerErrorEvent extends BaseEvent {}


export class BallBounced extends BaseEvent {}

