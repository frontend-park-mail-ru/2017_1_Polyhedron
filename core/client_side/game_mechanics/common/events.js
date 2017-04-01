/**
 * NEVER create instances of BaseEvent class with new. ALWAYS use classname.create(...).
 */
class BaseEvent {
    static get eventName() {
        return this.name;
    }

    static create(eventDetail) {
        return new CustomEvent(this.name, {
            detail: eventDetail,
        });
    }
}


export class PlatformMovedEvent extends BaseEvent {}


export class BallPositionCorrectionEvent extends BaseEvent {}


export class DefeatEvent extends BaseEvent {
    static create(eventDetail) {
        let playerIndex = eventDetail.playerIndex;
        let looserIndex = eventDetail.looserIndex;

        return new CustomEvent(this.name, {
            detail: looserIndex - playerIndex
        });
    }
}


export class EnemyPositionCorrectionEvent extends BaseEvent {
    static create(eventDetail) {
        let playerIndex = eventDetail.playerIndex;
        let enemyIndex = eventDetail.enemyIndex;
        let offset = eventDetail.offset;

        return new CustomEvent(this.name, {
            detail: {
                index: enemyIndex - playerIndex,
                offset: offset
            }
        });
    }
}


export class ServerMessageEvent extends BaseEvent {}


export class ClientMessageEvent extends BaseEvent {}


export class ConnectionClosedEvent extends BaseEvent {}


export class ServerErrorEvent extends BaseEvent {}

