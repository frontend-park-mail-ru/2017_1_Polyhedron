
import * as math from '../../../_lib/math';

import {Ball} from '../game_components/ball';
import {Platform} from '../game_components/platform';
import {TriangleField} from '../game_components/triangle_field';

import * as events from '../event_system/events';
import {GameComponent} from "../base/game_component";
import {EventBus} from "../event_system/event_bus";
import {Autowired, Load} from "../experimental/decorators";
import {getOffsetChecker} from "../base/geometry";
import {ConfigContext} from "../experimental/context";
import {getNearestCollisionMultiObstacle} from "../base/collision_handling";
import {GameWorldState} from "../event_system/messages";
import {NewDrawable} from "../experimental/interfaces";


export class GameWorld implements NewDrawable {

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

    @Load('game')
    private _gameConfig;

    private _lastCollidedObject: GameComponent = null;

    private static _platformFromTriangleField(triangleField: TriangleField) {
        const platformConfig = ConfigContext.getInstance().get('platform');

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

    public incrementScore() {
        ++this._score;
    }

    public getState(): GameWorldState {
        return {
            ballState: this._ball.getState(),
            platformsState: this._platforms.map(platform => platform.getState())
        };
    }

    public loadState({platformsInfo, ballInfo}) {
        this._ball.moveTo(math.add(ballInfo.position, this._position));
        this._ball.velocity = ballInfo.velocity;

        // TODO add platforms info handling
    }

    public get ball(): Ball {
        return this._ball;
    }

    public get userSectors(): TriangleField[] {
        return this._userSectors;
    }

    public get neutralSectors(): TriangleField[] {
        return this._neutralSectors;
    }

    public get platforms(): Platform[] {
        return this._platforms;
    }

    public getDrawing() {
        return canvas => {
            (this._userSectors as NewDrawable[])
                .concat(this._neutralSectors, this._platforms, [this._ball])
                .map(drawable => drawable.getDrawing())
                .forEach(draw => draw(canvas));

            this._writeScore(canvas);
        };
    }

    public movePlatform(platform, localOffsetVector, velocityVector?) {
        const globalOffset = platform.toGlobalsWithoutOffset(localOffsetVector);
        platform.moveByWithConstraints(globalOffset, velocityVector);
    }

    public updateBallState(position, velocity) {
        if (position) {
            this._ball.moveTo(position);
        }

        if (velocity) {
            this._ball.velocity = velocity;
        }
    }

    public makeIteration(time) {
        let restTime = time;
        let updateTime = this._innerMakeIteration(restTime);
        while (updateTime) {
            restTime -= updateTime;
            if (restTime === 0) {
                break;
            }

            updateTime = this._innerMakeIteration(restTime);
        }
    }

    private _innerMakeIteration(time) {
        const platformCollision = getNearestCollisionMultiObstacle(
            this.ball, this.platforms, 0, time, this.ball.radius / this._gameConfig.platformCollisionAccuracy
        );
        const userSectorCollision = getNearestCollisionMultiObstacle(
            this.ball, this.userSectors, 0, time, this.ball.radius / this._gameConfig.sectorCollisionAccuracy
        );
        const neutralSectorCollision = getNearestCollisionMultiObstacle(
            this.ball, this.neutralSectors, 0, time, this.ball.radius / this._gameConfig.sectorCollisionAccuracy
        );

        const firstCollisionData = [
            {
                collision: platformCollision,
                tag: 'platform'
            },
            {
                collision: userSectorCollision,
                tag: 'userSector'
            },
            {
                collision: neutralSectorCollision,
                tag: 'neutralSector'
            }
        ]
            .filter(({collision}) => collision)
            .sort((data1, data2) => data1.collision.time - data2.collision.time)[0];

        if (firstCollisionData) {
            this.ball.moveBy(math.multiply(this.ball.velocity, firstCollisionData.collision.time));

            if (firstCollisionData.tag === 'platform') {
                this._handlePlatformCollision(
                    firstCollisionData.collision.obstacle,
                    this.ball,
                    firstCollisionData.collision.point
                );
            } else if (firstCollisionData.tag === 'userSector') {
                this._handleUserSectorCollision(firstCollisionData.collision.obstacle, this.ball);
            } else if (firstCollisionData.tag === 'neutralSector') {
                this._handleNeutralSectorCollision(firstCollisionData.collision.obstacle, this.ball);
            }

            return firstCollisionData.collision.time;
        }

        this.ball.moveBy(math.multiply(this.ball.velocity, time));
        return null;
    }

    private _initSectors() {
        for (let i = 0; i !== this._userNum; ++i) {
            const userSector = new TriangleField(this._sectorHeight, this._sectorAngle, false);
            userSector.rotateBy(2 * this._sectorAngle * i);
            userSector.moveTo(this._position);

            const neutralSector = new TriangleField(this._sectorHeight, this._sectorAngle, true);
            neutralSector.rotateBy(this._sectorAngle * (2 * i + 1));
            neutralSector.moveTo(this._position);

            this._userSectors.push(userSector);
            this._neutralSectors.push(neutralSector);
        }
    }

    private _initPlatforms() {
        this._platforms = this._userSectors.map(sector => GameWorld._platformFromTriangleField(sector));
    }

    private _initBall() {
        this._ball = new Ball(this._ballRadius);
        this._ball.moveTo(this._position);
    }

    private _handleUserSectorCollision(sector: TriangleField, ball: Ball) {
        if (sector !== this._lastCollidedObject) {
            // GameWorld.logger.debug(  // TODO remove or import correctly
            //     'User sector collided' +
            //     '; id = ' + sector.id +
            //     '; angle = ' + sector.rotation / Math.PI * 180
            // );

            ball.bounceNorm(sector.getBottomNorm());
            this._lastCollidedObject = sector;

            //this.eventBus.dispatchEvent(events.gameEvents.ClientDefeatEvent.create(sector.id));   // TODO uncomment
        }
    }

    private _handleNeutralSectorCollision(sector, ball) {
        if (sector !== this._lastCollidedObject) {
            // GameWorld.logger.debug(  // TODO remove or import correctly
            //     'Neutral sector collided' +
            //     '; id = ' + sector.id +
            //     '; angle = ' + sector.rotation / Math.PI * 180
            // );

            ball.bounceNorm(sector.getBottomNorm());
            this._lastCollidedObject = sector;
        }
    }

    private _handlePlatformCollision(platform, ball, point) {
        if (platform !== this._lastCollidedObject) {
            // GameWorld.logger.debug(  // TODO remove or import correctly
            //     'Platform collided' +
            //     '; id = ' + platform.id +
            //     '; angle = ' + platform.rotation / Math.PI * 180
            // );

            ball.bouncePoint(point, platform.velocity);
            this._lastCollidedObject = platform;

            this.eventBus.dispatchEvent(events.gameEvents.BallBounced.create(platform.id));
        }
    }

    private _writeScore(canvas) {
        const context = canvas.getContext('2d');
        context.font = '30px Arial';
        context.textAlign = "center";
        context.fillStyle = "white";

        const message = "Вы отбили " + this._score + " мячей";
        context.fillText(message, canvas.width * 0.5, canvas.height);
    }
}
