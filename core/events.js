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


class PlatformMovedEvent extends BaseEvent {}


class BallPositionCorrectionEvent extends BaseEvent {}


class DefeatEvent extends BaseEvent {}


class EnemyPositionCorrectionEvent extends BaseEvent {}


module.exports.PlatformMovedEvent = PlatformMovedEvent;
module.exports.BallPositionCorrectionEvent = BallPositionCorrectionEvent;
module.exports.DefeatEvent = DefeatEvent;
module.exports.EnemyPositionCorrectionEvent = EnemyPositionCorrectionEvent;