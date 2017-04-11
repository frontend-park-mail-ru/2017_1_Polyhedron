
import * as math from '../../../_lib/math';

import {Ball} from './game_components/ball';
import {Platform} from './game_components/platform';
import {TriangleField} from './game_components/triangle_field';

import * as events from '../common/events';


export class GameWorld {
    constructor(userNum, sectorHeight, ballRadius, position) {
        this._userNum = userNum;
        this._sectorAngle = Math.PI / userNum;
        this._sectorHeight = sectorHeight;
        this._ballRadius = ballRadius;
        this._position = position;

        this._userSectors = [];
        this._neutralSectors = [];
        this._platforms = [];
        this._ball = null;

        this._score = 0; // TODO only for pretest

        this._initSectors();
        this._initBall();
        this._initPlatforms();
    }

    get ball() {
        return this._ball;
    }

    get userSectors() {
        return this._userSectors;
    }

    get neutralSectors() {
        return this._neutralSectors;
    }

    get platforms() {
        return this._platforms;
    }

    _initSectors() {
        for (let i = 0; i != this._userNum; ++i) {
            let userSector = new TriangleField(this._sectorHeight, this._sectorAngle, false);
            userSector.rotateBy(2 * this._sectorAngle * i);
            userSector.moveTo(this._position);

            let neutralSector = new TriangleField(this._sectorHeight, this._sectorAngle, true);
            neutralSector.rotateBy(this._sectorAngle * (2 * i + 1));
            neutralSector.moveTo(this._position);

            this._userSectors.push(userSector);
            this._neutralSectors.push(neutralSector);
        }
    }

    _initPlatforms() {
        // using default parameters for platforms
        this._platforms = this._userSectors.map(sector => Platform.platformFromTriangleField(sector));
    }

    _initBall() {
        this._ball = new Ball(this._ballRadius);
        this._ball.moveTo(this._position);
    }

    movePlatform(platform, localOffsetVector, velocityVector) {
        let globalOffset = platform.toGlobalsWithoutOffset(localOffsetVector);
        platform.moveByWithConstraints(globalOffset, velocityVector);
    }

    updateBallState(position, velocity) {
        if (position) {
            this._ball.moveTo(position);
        }

        if (velocity) {
            this._ball.velocity = velocity;
        }
    }

    _makeIteration(time) {
        this.ball.moveBy(math.multiply(this.ball.velocity, time));

        this.userSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this.ball.position) && sector.reachesBottomLevel(this.ball)) {
                this._handleUserSectorCollision(sector, this.ball);
            }
        });

        this.neutralSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this.ball.position) && sector.reachesBottomLevel(this.ball)) {
                this._handleNeutralSectorCollision(sector, this.ball);
            }
        });

        this.platforms.forEach(platform => {
            const point = platform.getBouncePoint(this.ball);
            if (point) {
                this._handlePlatformCollision(platform, this.ball, point);
            }
        });
    }

    _handleUserSectorCollision(sector) {
        if (sector != this._lastCollidedObject) {
            window.dispatchEvent(events.ClientDefeatEvent.create(sector.id));
        }
    }

    _handleNeutralSectorCollision(sector, ball) {
        if (sector != this._lastCollidedObject) {
            ball.bounceNorm(sector.getBottomNorm());
            this._lastCollidedObject = sector;
        }
    }

    _handlePlatformCollision(platform, ball, point) {
        if (platform != this._lastCollidedObject) {
            ball.bouncePoint(point, platform.velocity);
            this._lastCollidedObject = platform;

            window.dispatchEvent(events.BallBounced.create(platform.id));
        }
    }

    draw(canvas) {
        this._userSectors.forEach(sector => sector.draw(canvas));
        this._neutralSectors.forEach(sector => sector.draw(canvas));
        this._platforms.forEach(platform => platform.draw(canvas));
        this._ball.draw(canvas);

        this._writeScore(canvas);
    }

    _writeScore(canvas) {
        const context = canvas.getContext('2d');
        context.font = '30px Arial';
        context.textAlign = "center";
        context.fillStyle = "white";

        const message = "Вы отбили " + this._score + " мячей";
        context.fillText(message, canvas.width * 0.5, canvas.height);
    }


    scale(scaleFactor) {
        //TODO fix (game world scaling sometimes kills bots and does not move objects to corresponding places)
        this._userSectors.forEach(sector => sector.scale(scaleFactor));
        this._neutralSectors.forEach(sector => sector.scale(scaleFactor));
        this._platforms.forEach(platform => platform.scale(scaleFactor));
        this._ball.scale(scaleFactor);
    }
}
