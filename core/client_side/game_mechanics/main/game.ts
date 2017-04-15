
import * as math from '../../../_lib/math';
import * as events from '../event_system/events';
import {GameWorld} from './game_world';
import {Bot} from '../ai/bot';
import {GameComponent} from "../base/game_component";
import {EventBus} from "../event_system/event_bus";
import {Autowired, NewConfigurable, Load} from "../experimental/decorators";
import {Application} from "../experimental/application";


const PLATFORM_TOLERANCE = 5;

const MILLISECONDS_PER_SECOND = 1000;

const MODES = {
    single: 'single',
    multi: 'multi'
};

const DEFAULT_MODE = MODES.single;



@Application()
@NewConfigurable('game')    // TODO Ether refactor or optimize out
export class Game {
    @Autowired(EventBus)
    private eventBus: EventBus;

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    @Load('game/playersNum')
    private _playersNum: number;

    @Load('game/frameRate')
    private _frameRate: number;

    @Load('game/fillFactor')
    private _fillFactor: number;

    @Load('game/relativeBallVelocity')
    private _initialRelativeBallVelocity: number[];

    @Load('game/ballRelativeRadius')
    private _ballRelativeRadius: number;

    @Load('game/defaultCanvasSize')
    private _defaultCanvasSize: number;

    @Load('game/ballVelocity')
    private _ballVelocity: number[];

    private _platformVelocityDirection: number[] = [0, 0];
    private _lastCollidedObject: GameComponent;

    private _setIntervalID: number;
    private _lastPlatformPosition: number[];
    private _mode: string;

    private _bots: Bot[];
    private _world: GameWorld;

    constructor(canvas, mode?) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this._lastCollidedObject = null;

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
            this._bots = [1, 2, 3].map(i => new Bot(this._getPlatformByIndex(i), this._world.ball));
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
        const worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
        const canvasSize = Math.min(this._canvas.width, this._canvas.height);
        const sectorHeight = canvasSize * this._fillFactor / 2;
        const ballRadius = this._ballRelativeRadius * sectorHeight;
        const ballPosition = math.add(
            worldPosition, math.multiply([1 / 2 - 1, 1 / 2 - 1], sectorHeight / 2)
        );

        //const ballVelocity = math.multiply(this._initialRelativeBallVelocity, this._defaultCanvasSize / this._frameRate);

        this._world = new GameWorld(this._playersNum, sectorHeight, ballRadius, worldPosition);
        this._world.ball.moveTo(ballPosition);   // TODO remove. Now it just moves ball from center
        this._world.ball.velocity = this._ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    _setListeners() {
        window.addEventListener(events.networkEvents.DefeatEvent.eventName,
            event => this._handleDefeatEvent(event));

        /*
        window.addEventListener(events.ClientDefeatEvent.eventName,
            event => this._handleClientDefeatEvent(event));
        */
        this.eventBus.addEventListener(events.gameEvents.ClientDefeatEvent.eventName, event => this._handleClientDefeatEvent(event));
        this.eventBus.addEventListener(
            events.controllerEvents.ArrowDirectionEvent.eventName,
            event => this._platformVelocityDirection = event.detail
        );

        window.addEventListener(events.networkEvents.WorldUpdateEvent.eventName, event => this._handleWorldUpdateEvent(event));

        /*
        window.addEventListener(events.BallBounced.eventName, event => {
            if (event.detail === this._activePlatform.id) {
                ++this._world._score;
            }
        });
        */
        window.addEventListener(events.gameEvents.BallBounced.eventName, event => {
            if (event.detail === this._activePlatform.id) {
                //++this._world._score;
            }
        });

        window.addEventListener('dblclick', () => {
            this._canvas.style.backgroundColor = 'black';
            this._canvas.webkitRequestFullScreen();
        });

        window.addEventListener('webkitfullscreenchange', () => {
            this._canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        });
    }

    _makeIteration(time) {
        this._redraw();

        const timeScaleFactor = Math.min(this._canvas.height, this._canvas.width) / this._defaultCanvasSize;
        const scaledTime = time * timeScaleFactor;

        this._world._makeIteration(scaledTime);
        this._handleUserInput(scaledTime);

        let activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }
    }

    _handleUserInput (time: number) {
        const platformVelocity = 3;
        const localOffset = math.multiply(this._platformVelocityDirection, platformVelocity);
        this._world.movePlatform(this._getPlatformByIndex(0), localOffset, math.divide(localOffset, 5 * time)); // TODO get rid of magic number

        let offset = localOffset[0];
        if (offset > 1) {
            this._throwPlatformMovedEvent(localOffset[0]);
        }
    }

    _throwPlatformMovedEvent(platformOffset) {
        /*
         window.dispatchEvent(
         events.PlatformMovedEvent.create(platformOffset)
         );
         */
    }

    _handleDefeatEvent(event) {
        /*
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
        */

    }

    _handleClientDefeatEvent(event) {
        /*
        let sectorId = event.detail;
        let playerId = this._activeSector.id;

        if (sectorId == playerId) {
            alert("Вы проиграли");
        } else {
            alert("Вы победили!");
        }

        this._world.userSectors.filter(sector => sector.id == sectorId).forEach(sector => sector.setLoser());

        this._redraw();
        this.stop();
        */
    }

    _handleWorldUpdateEvent(event) {
        let gameUpdate = event.detail;

        gameUpdate.platformsUpdate.forEach(platformUpdate => {
            this._getPlatformByIndex(platformUpdate.index).moveTo(platformUpdate.position);
        });

        this._world.updateBallState(gameUpdate.ballUpdate.position, gameUpdate.ballUpdate.velocity);
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}

