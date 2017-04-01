
import * as math from '../../../_lib/math';
import * as events from '../common/events';
import {GameWorld} from '../logic/game_world';

const KEY_LEFT = 39;
const KEY_RIGHT = 37;

const DEFAULT_PLAYERS_NUM = 4;
const DEFAULT_FRAME_RATE = 60;
const DEFAULT_FILL_FACTOR = 0.8;
const DEFAULT_BALL_RELATIVE_RADIUS = 0.05;
const DEFAULT_RELATIVE_BALL_OFFSET = [0.1, 0.05];
const DEFAULT_RELATIVE_BALL_VELOCITY = [0.25, 0.25];

const PLATFORM_TOLERANCE = 5;

const MILLISECONDS_PER_SECOND = 1000;


export class Game {
    constructor(canvas, playersNum, frameRate, fillFactor, ballRelativeRadius,
                initialRelativeBallOffset, initialRelativeBallVelocity) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._playersNum = playersNum || DEFAULT_PLAYERS_NUM;
        this._frameRate = frameRate || DEFAULT_FRAME_RATE;
        this._fillFactor = fillFactor || DEFAULT_FILL_FACTOR;
        this._initialRelativeBallOffset = initialRelativeBallOffset || DEFAULT_RELATIVE_BALL_OFFSET;
        this._initialRelativeBallVelocity  = initialRelativeBallVelocity || DEFAULT_RELATIVE_BALL_VELOCITY;
        this._ballRelativeRadius = ballRelativeRadius || DEFAULT_BALL_RELATIVE_RADIUS;

        this._lastCollidedObject = null;

        this._leftPressed = false;
        this._rightPressed = false;

        this._platformVelocityDirection = [0, 0];
        this._setIntervalID = null;
        this._lastPlatformPosition = null;
    }

    start() {
        this._setListeners();
        this._initWorld();

        let time = MILLISECONDS_PER_SECOND / this._frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);
    }

    stop() {
        clearInterval(this._setIntervalID);
    }

    continueGame() {
        let time = MILLISECONDS_PER_SECOND / this._frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);
    }

    _getPlatformByIndex(index) {
        return this._world.platforms[this._getItemIndex(index)];
    }

    _getUserSectorByIndex(index) {
        return this._world.userSectors[this._getItemIndex(index)];
    }

    _getItemIndex(index) {
        return (this._playerItemsIndex + index) % this._playersNum;
    }

    get _playerItemsIndex() {
        return Math.floor(this._playersNum / 2);
    }

    get _activePlatform() {
        return this._world._platforms[this._playerItemsIndex];
    }

    get _activeSector() {
        return this._world.userSectors[this._playerItemsIndex];
    }

    _initWorld() {
        let worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
        let sectorHeight = Math.min(this._canvas.width, this._canvas.height) * this._fillFactor / 2;
        let ballRadius = this._ballRelativeRadius * sectorHeight;
        let ballPosition = math.add(worldPosition, math.multiply(this._initialRelativeBallOffset, sectorHeight));
        let ballVelocity = math.multiply(this._initialRelativeBallVelocity, sectorHeight / this._frameRate);

        this._world = new GameWorld(this._playersNum, sectorHeight, ballRadius, worldPosition);
        this._world.ball.moveTo(ballPosition);   // TODO remove. Now it just moves ball from center
        this._world.ball.velocity = ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    _setListeners() {
        document.addEventListener("keydown", event => this._handleKeyDown(event));
        document.addEventListener("keyup", event => this._handleKeyUp(event));
        window.addEventListener(events.DefeatEvent.eventName,
            event => this._handleDefeatEvent(event));
        window.addEventListener(events.BallPositionCorrectionEvent.eventName,
            event => this._handleBallPositionCorrectionEvent(event));
        window.addEventListener(events.EnemyPositionCorrectionEvent.eventName,
            event => this._handleEnemyMovementEvent(event));
    }

    _makeIteration(time) {
        this._redraw();

        this._world.ball.moveBy(math.multiply(this._world.ball.velocity, time));
        this._handleUserInput();

        this._world.userSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleUserSectorCollision(sector, this._world.ball);
            }
        });

        this._world.neutralSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleNeutralSectorCollision(sector, this._world.ball);
            }
        });

        this._world.platforms.forEach(platform => {
            if (platform.inBounceZone(this._world.ball)) {
                this._handlePlatformCollision(platform, this._world.ball);
            }
        });

        let activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }
    }

    _handleUserSectorCollision(sector, ball) {
        if (sector != this._lastCollidedObject) {
            //TODO maybe need to return back
            ball.bounce(sector.getBottomNorm());
            this._lastCollidedObject = sector;
            //this.stop();
            //sector.setLoser();
            //this._redraw();
        }
    }

    _handleNeutralSectorCollision(sector, ball) {
        if (sector != this._lastCollidedObject) {
            ball.bounce(sector.getBottomNorm());
            this._lastCollidedObject = sector;
        }
    }

    _handlePlatformCollision(platform, ball) {
        if (platform != this._lastCollidedObject) {
            ball.bounce(platform.getNorm());
            this._lastCollidedObject = platform;
        }
    }

    _handleKeyDown(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = true;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = true;
        }
        this._updatePlatformVelocityDirection();
    }

    _handleKeyUp(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = false;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = false;
        }
        this._updatePlatformVelocityDirection();
    }

    _updatePlatformVelocityDirection() {
        if (!this._leftPressed && !this._rightPressed) {
            this._platformVelocityDirection = [0, 0];
        } else if (this._leftPressed && !this._rightPressed) {
            this._platformVelocityDirection = [-1, 0];
        } else if (!this._leftPressed && this._rightPressed) {
            this._platformVelocityDirection = [1, 0];
        } else {
            this._platformVelocityDirection = [0, 0];
        }
    }

    _handleUserInput () {
        // TODO refactor. Just testing
        /*
        this._world.platforms.forEach(platform => {
            let platformVelocity = 0.5;
            let localOffset = math.multiply(this._platformVelocityDirection, platformVelocity);

            this._movePlatform(platform, localOffset)
        });
        */
        let platformVelocity = 0.5;
        let localOffset = math.multiply(this._platformVelocityDirection, platformVelocity);
        this._movePlatform(this._getPlatformByIndex(0), localOffset);

        let offset = localOffset[0];
        if (offset > 1) {
            this._throwPlatformMovedEvent(localOffset[0]);
        }
    }

    _movePlatform(platform, localOffsetVector) {
        // TODO refactor. Just testing
        let originalPosition = platform.optionalPositioningInfo.originalPosition;
        let offsetVec = math.subtract(platform.position, originalPosition);

        let globalOffset = platform.toGlobalsWithoutOffset(localOffsetVector);
        let newOffsetVec = math.add(globalOffset, offsetVec);

        if (math.norm(newOffsetVec) <= platform.optionalPositioningInfo.maxOffset) {
            platform.moveBy(globalOffset);
        }
    }

    _throwPlatformMovedEvent(platformOffset) {
        window.dispatchEvent(
            events.PlatformMovedEvent.create(platformOffset)
        );
    }

    _handleDefeatEvent(event) {
        // TODO сделать что-нибудь поинтереснее
        let sectorId = this._getItemIndex(event.detail);
        if (sectorId == this._playerItemsIndex) {
            alert("You lose");
        } else {
            alert("You win");
        }
        this._world.userSectors[sectorId].setLoser();
        this._redraw();
        this.stop();

    }

    _handleBallPositionCorrectionEvent(event) {
        console.log("Ball position corrected");
        this._world.ball.moveTo(event.detail);
    }

    _handleEnemyMovementEvent(event) {
        console.log("Enemy moved");
        let detail = event.detail;

        let platform = this._getPlatformByIndex(detail.index);
        this._movePlatform(platform, math.multiply([1, 0], detail.offset));
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}

