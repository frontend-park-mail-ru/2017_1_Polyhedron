'use strict';

import * as math from '../../../_lib/math';
import {Platform} from "../game_components/platform";
import {Ball} from "../game_components/ball";
import {NewConfigurable, Load} from "../experimental/decorators";


@NewConfigurable('bot')
export class Bot {
    private _platform: Platform;
    private _ball: Ball;

    @Load('bot/velocity')
    private _velocity: number;

    @Load('bot/time')
    private _time: number;
    private _setIntervalID;

    constructor(platform, ball, velocity?, time?) {
        this._platform = platform;
        this._ball = ball;
        this._velocity = velocity;
        this._time = time;
        this._setIntervalID = null;

        this.init();
    }

    init() {
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
