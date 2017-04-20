
import * as math from '../../../_lib/math';

import {Ball} from '../game_components/ball';
import {Platform} from '../game_components/platform';
import {TriangleField} from '../game_components/triangle_field';

import * as events from '../event_system/events';
import {GameComponent} from "../base/game_component";
import {EventBus} from "../event_system/event_bus";
import {Autowired} from "../experimental/decorators";
import {getOffsetChecker} from "../base/geometry";
import {Context} from "../experimental/context";


export class GameWorld {
    @Autowired(EventBus)
    private eventBus: EventBus;

    private _userNum: number;
    private _sectorAngle: number;
    private _sectorHeight: number;
    private _ballRadius: number;
    private _position: number[];
    private _userSectors: TriangleField[];
    private _neutralSectors: TriangleField[];
    private _platforms: Platform[];
    private _ball: Ball;
    private _score: number;

    private _lastCollidedObject: GameComponent = null;

    constructor(userNum: number, sectorHeight: number, ballRadius: number, position: number[]) {
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

    incrementScore() {
        ++this._score;
    }

    get ball(): Ball {
        return this._ball;
    }

    get userSectors(): TriangleField[] {
        return this._userSectors;
    }

    get neutralSectors(): TriangleField[] {
        return this._neutralSectors;
    }

    get platforms(): Platform[] {
        return this._platforms;
    }

    draw(canvas) {
        this._userSectors.forEach(sector => sector.draw(canvas));
        this._neutralSectors.forEach(sector => sector.draw(canvas));
        this._platforms.forEach(platform => platform.draw(canvas));
        this._ball.draw(canvas);

        this._writeScore(canvas);
    }

    movePlatform(platform, localOffsetVector, velocityVector?) {
        const globalOffset = platform.toGlobalsWithoutOffset(localOffsetVector);
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
        this._platforms = this._userSectors.map(sector => GameWorld._platformFromTriangleField(sector));
    }

    _initBall() {
        this._ball = new Ball(this._ballRadius);
        this._ball.moveTo(this._position);
    }

    _makeIteration(time) {
        this.ball.moveBy(math.multiply(this.ball.velocity, time));

        this.userSectors.forEach(sector => {
            if (sector.isInSector(this.ball.position) && sector.reachesBottomLevel(this.ball)) {
                this._handleUserSectorCollision(sector, this.ball);
            }
        });

        this.neutralSectors.forEach(sector => {
            if (sector.isInSector(this.ball.position) && sector.reachesBottomLevel(this.ball)) {
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

    _handleUserSectorCollision(sector, ball) {
        if (sector != this._lastCollidedObject) {
            ball.bounceNorm(sector.getBottomNorm());
            this._lastCollidedObject = sector;

            this.eventBus.dispatchEvent(events.gameEvents.ClientDefeatEvent.create(sector.id));
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

            this.eventBus.dispatchEvent(events.gameEvents.BallBounced.create(platform.id));
        }
    }

    _writeScore(canvas) {
        const context = canvas.getContext('2d');
        context.font = '30px Arial';
        context.textAlign = "center";
        context.fillStyle = "white";

        const message = "Вы отбили " + this._score + " мячей";
        context.fillText(message, canvas.width * 0.5, canvas.height);
    }

    static _platformFromTriangleField(triangleField: TriangleField) {
        const platformConfig = Context.getInstance().getDataSource('platform');

        const relativeDistance = platformConfig.relativeDistance;
        const relativeLength = platformConfig.relativeLength;
        const totalLength = triangleField.getWidthOnRelativeDistance(relativeDistance);
        const platformLength = totalLength * relativeLength;

        const platformWidth = platformConfig.aspectRatio * platformLength;
        const platform = new Platform(platformLength, platformWidth);


        // using such coordinates because triangleField coordinate system origin is in the topmost corner.
        const position = triangleField.toGlobals([0, -triangleField.height * (1 - relativeDistance)]);
        const rotation = triangleField.rotation;

        platform.moveTo(position);
        platform.rotateTo(rotation);

        platform.positionValidator = getOffsetChecker(platform, triangleField);
        triangleField.addChild(platform);

        return platform;
    }
}
