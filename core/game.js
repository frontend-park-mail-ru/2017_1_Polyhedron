
const math = require('./_lib/math');
const events = require('./events');
const GameWorld = require('./game_world').GameWorld;

const KEY_LEFT = 39;
const KEY_RIGHT = 37;

const DEFAULT_PLAYER_NUM = 4;
const DEFAULT_FRAME_RATE = 60;
const DEFAULT_FILL_FACTOR = 0.8;
const DEFAULT_BALL_RELATIVE_RADIUS = 0.05;
const DEFAULT_RELATIVE_BALL_OFFSET = [0.1, 0.05];
const DEFAULT_RELATIVE_BALL_VELOCITY = [0.25, 0.25];

const PLATFORM_TOLERANCE = 5;


class Game {
    constructor(canvas, playerNum, frameRate, fillFactor, ballRelativeRadius,
                initialRelativeBallOffset, initialRelativeBallVelocity) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._playerNum = playerNum || DEFAULT_PLAYER_NUM;
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

        let time = 1000 / this._frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);
    }

    get _activePlatform() {
        return this._world._platforms[Math.floor(this._playerNum / 2)];
    }

    _initWorld() {
        let worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
        let sectorHeight = Math.min(this._canvas.width, this._canvas.height) * this._fillFactor / 2;
        let ballRadius = this._ballRelativeRadius * sectorHeight;
        let ballPosition = math.add(worldPosition, math.multiply(this._initialRelativeBallOffset, sectorHeight));
        let ballVelocity = math.multiply(this._initialRelativeBallVelocity, sectorHeight / this._frameRate);

        this._world = new GameWorld(this._playerNum, sectorHeight, ballRadius, worldPosition);
        this._world.ball.moveTo(ballPosition);   // TODO remove. Now it just moves ball from center
        this._world.ball.velocity = ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    _setListeners() {
        document.addEventListener("keydown", event => this._handleKeyDown(event), false);
        document.addEventListener("keyup", event => this._handleKeyUp(event), false);
    }

    _makeIteration(time) {
        this._redraw();

        this._world.ball.moveBy(math.multiply(this._world.ball.velocity, time));
        this._handleUserInput();

        this._world.userSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleUserSectorCollision(sector);
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

    _stopGameLoop() {
        clearInterval(this._setIntervalID);
    }

    _handleUserSectorCollision(sector) {
        if (sector != this._lastCollidedObject) {
            this._stopGameLoop();
            sector.setLoser();
            this._redraw();
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
        this._world.platforms.forEach(platform => {
            let platformVelocity = 0.5;

            let originalPosition = platform.optionalPositioningInfo.originalPosition;
            let offsetVec = math.subtract(platform.position, originalPosition);

            let localStep = math.multiply(this._platformVelocityDirection, platformVelocity);

            let globalStep = platform.toGlobalsWithoutOffset(localStep);
            let newOffsetVec = math.add(globalStep, offsetVec);

            if (math.norm(newOffsetVec) <= platform.optionalPositioningInfo.maxOffset) {
                platform.moveBy(globalStep);
            }
        });
    }

    _throwPlatformMovedEvent(platformOffset) {
        document.dispatchEvent(
            new events.PlatformMovedEvent(platformOffset)
        );
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}


module.exports.Game = Game;

