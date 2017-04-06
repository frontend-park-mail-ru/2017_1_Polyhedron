
import * as math from '../../../../_lib/math';


const DEFAULT_VELOCITY = 5;
const MILLISECONDS_PER_SECOND = 1000;
const DEFAULT_FRAME_RATE = 60;


export class Bot {
    constructor(platform, ball, velocity, time) {
        this._platform = platform;
        this._ball = ball;
        this._velocity = velocity || DEFAULT_VELOCITY;

        this._time = time || MILLISECONDS_PER_SECOND / DEFAULT_FRAME_RATE;
        this._setIntervalID = null;

        this._init();
    }

    _init() {
        this._setIntervalID = setInterval(() => {
            this._movePlatform(this._time);
        }, this._time);
    }

    _movePlatform(time) {
        const offsetVector = math.multiply(this._getOffsetDirection(), this._velocity * time);
        const xOffset = [offsetVector[0], 0];
        const yOffset = [0, offsetVector[1]];

        this._platform.moveByWithConstraints(xOffset);
        this._platform.moveByWithConstraints(yOffset);
    }

    _getOffsetDirection() {
        const ballOffset = this._platform.toLocals(this._ball.position);
        ballOffset[1] = -1; // this line moves all bot platforms to the very bottom of corresponding sectors

        const offsetNorm =  math.norm(ballOffset);
        const localDirection = math.divide(ballOffset, offsetNorm);

        return this._platform.toGlobalsWithoutOffset(localDirection);
    }
}
