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


export class DefeatEvent extends BaseEvent {}


export class EnemyPositionCorrectionEvent extends BaseEvent {}

