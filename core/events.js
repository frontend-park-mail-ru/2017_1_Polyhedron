
class PlatformMovedEvent {
    static get eventName() {
        return "PlatformMoved";
    }

    static create(platformOffset) {
        return new CustomEvent(PlatformMovedEvent.eventName, {
            detail: platformOffset,
        });
    }
}


class BallPositionCorrectionEvent {
    static get eventName() {
        return "BallPositionCorrectionEvent";
    }

    static create(ballPosition) {
        return new CustomEvent(BallPositionCorrectionEvent.eventName, {
            detail: ballPosition
        });
    }
}


class DefeatEvent {
    static get eventName() {
        return "DefeatEvent";
    }

    static create(sectorIndex) {
        return new CustomEvent(DefeatEvent.eventName, {
            detail: sectorIndex
        });
    }
}


module.exports.PlatformMovedEvent = PlatformMovedEvent;
module.exports.BallPositionCorrectionEvent = BallPositionCorrectionEvent;
module.exports.DefeatEvent = DefeatEvent;
