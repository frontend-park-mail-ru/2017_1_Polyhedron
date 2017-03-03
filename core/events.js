
class PlatformMovedEvent extends CustomEvent {
    static get eventName() {
        return "PlatformMoved";
    }

    constructor(platformOffset) {
        super(PlatformMovedEvent.eventName, {
            detail: platformOffset,
        });
    }
}


class BallPositionCorrectionEvent extends CustomEvent {
    static get eventName() {
        return "BallPositionCorrectionEvent";
    }

    constructor(ballPosition) {
        super(BallPositionCorrectionEvent.eventName, {
            detail: ballPosition
        });
    }
}


class LoseEvent extends CustomEvent {
    static get eventName() {
        return "LoseEvent";
    }

    constructor() {
        super(LoseEvent.eventName);
    }
}


module.exports.PlatformMovedEvent = PlatformMovedEvent;
module.exports.BallPositionCorrectionEvent = BallPositionCorrectionEvent;
module.exports.LoseEvent = LoseEvent;
