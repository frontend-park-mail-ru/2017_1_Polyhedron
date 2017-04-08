
import * as math from '../../../_lib/math';
import * as events from '../common/events';
import {GameWorld} from '../logic/game_world';
import {Bot} from '../logic/ai/bot';

const KEY_LEFT = 39;
const KEY_RIGHT = 37;
const KEY_UP = 38;
const KEY_DOWN = 40;

const DEFAULT_PLAYERS_NUM = 4;
const DEFAULT_FRAME_RATE = 60;
const DEFAULT_FILL_FACTOR = 0.8;
const DEFAULT_BALL_RELATIVE_RADIUS = 0.05;
const DEFAULT_RELATIVE_BALL_OFFSET = [0.1, 0.05];
const DEFAULT_RELATIVE_BALL_VELOCITY = [0.25, 0.25];

const PLATFORM_TOLERANCE = 5;

const MILLISECONDS_PER_SECOND = 1000;

const MODES = {
    single: 'single',
    multi: 'multi'
};

const DEFAULT_MODE = MODES.single;


export class Game {
    constructor(canvas, playersNum, frameRate, fillFactor, ballRelativeRadius,
                initialRelativeBallOffset, initialRelativeBallVelocity, mode) {
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
        this._upPressed = false;
        this._downPressed = false;

        this._platformVelocityDirection = [0, 0];
        this._setIntervalID = null;
        this._lastPlatformPosition = null;
        this._mode = mode || DEFAULT_MODE;
    }

    start() {
        this._setListeners();
        this._initWorld();

        let time = MILLISECONDS_PER_SECOND / this._frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);

        //TODO remove (temporary solution while multiplayer is unavailable)
        if (this._mode === MODES.single) {
            this._bots = [1, 2, 3].map(i => new Bot(this._getPlatformByIndex(i), this._world.ball, 0.21, time));
        }
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

    /**
     *
     * @param index {number}: index relative to player's one
     * @returns {number} index of the entity which can be obtained cyclically iterating clockwise
     * @private
     */
    _getItemIndex(index) {
        let result = (this._playerItemsIndex + index) % this._playersNum;

        return result >= 0 ? result : result + this._playersNum;
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

        window.addEventListener(events.ClientDefeatEvent.eventName,
            event => this._handleClientDefeatEvent(event));

        window.addEventListener(events.BallPositionCorrectionEvent.eventName,
            event => this._handleBallPositionCorrectionEvent(event));

        window.addEventListener(events.EnemyPositionCorrectionEvent.eventName,
            event => this._handleEnemyMovementEvent(event));

        window.addEventListener(events.WorldUpdateEvent.eventName, event => this._handleWorldUpdateEvent(event));

        window.addEventListener(events.BallBounced.eventName, event => {
            if (event.detail === this._activePlatform.id) {
                ++this._world._score;
            }
        })
    }

    _makeIteration(time) {
        this._redraw();
        this._world._makeIteration(time);
        this._handleUserInput();

        let activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }
    }

    _handleKeyDown(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = true;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = true;
        } else if (event.keyCode == KEY_DOWN) {
            this._downPressed = true;
        } else if (event.keyCode == KEY_UP) {
            this._upPressed = true;
        }

        this._updatePlatformVelocityDirection();
    }

    _handleKeyUp(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = false;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = false;
        } else if (event.keyCode == KEY_DOWN) {
            this._downPressed = false;
        } else if (event.keyCode == KEY_UP) {
            this._upPressed = false;
        }
        this._updatePlatformVelocityDirection();
    }

    _updatePlatformVelocityDirection() {
        return this._platformVelocityDirection = [this._getPlatformHorDirection(), this._getPlatformVertDirection()];
    }

    _getPlatformHorDirection() {
        if (!this._leftPressed && !this._rightPressed) {
            return 0;
        } else if (this._leftPressed && !this._rightPressed) {
            return -1;
        } else if (!this._leftPressed && this._rightPressed) {
            return 1;
        } else {
            return 0;
        }
    }

    _getPlatformVertDirection() {
        if (!this._downPressed && !this._upPressed) {
            return 0;
        } else if (this._downPressed && !this._upPressed) {
            return -1;
        } else if (!this._downPressed && this._upPressed) {
            return 1;
        } else {
            return 0;
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
        let platformVelocity = 1.5;
        let localOffset = math.multiply(this._platformVelocityDirection, platformVelocity);
        this._world.movePlatform(this._getPlatformByIndex(0), localOffset);

        let offset = localOffset[0];
        if (offset > 1) {
            this._throwPlatformMovedEvent(localOffset[0]);
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

    _handleClientDefeatEvent(event) {
        let sectorId = event.detail;
        let playerId = this._activeSector.id;

        if (sectorId == playerId) {
            alert("You lose");
        } else {
            alert("You win");
        }

        this._world.userSectors.filter(sector => sector.id == sectorId).forEach(sector => sector.setLoser());

        this._redraw();
        this.stop();
    }

    _handleBallPositionCorrectionEvent(event) {
        console.log("Ball position corrected");
        this._world.ball.moveTo(event.detail);
    }

    _handleWorldUpdateEvent(event) {
        let gameUpdate = event.detail;

        gameUpdate.platformsUpdate.forEach(platformUpdate => {
            this._getPlatformByIndex(platformUpdate.index).moveTo(platformUpdate.position);
        });

        this._world.updateBallState(gameUpdate.ballUpdate.position, gameUpdate.ballUpdate.velocity);
    }

    _handleEnemyMovementEvent(event) {
        console.log("Enemy moved");
        let detail = event.detail;

        let platform = this._getPlatformByIndex(detail.index);
        this._world.movePlatform(platform, math.multiply([1, 0], detail.offset));
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}

