
import * as math from '../../../_lib/math';
import * as events from '../event_system/events';
import {GameWorld} from './game_world';
import {Bot} from '../ai/bot';
import {GameComponent} from "../base/game_component";
import {EventBus} from "../event_system/event_bus";
import {Autowired, Load} from "../experimental/decorators";
import {Application} from "../experimental/application";
import {ServerCommunicator} from "../network/server_communicator";
import {services} from "../../configs/services";


const PLATFORM_TOLERANCE = 5;

const MILLISECONDS_PER_SECOND = 1000;

const MODES = {
    single: 'single',
    multi: 'multi'
};

const DEFAULT_MODE = MODES.multi;

const ALERT_SELECTOR = '.js-alert';


@Application(services)
export class Game {
    @Autowired(EventBus)
    private eventBus: EventBus;

    @Load('game')
    private _gameConfig: any;

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    private _alert: Element;

    private _platformVelocityDirection: number[] = [0, 0];
    private _lastCollidedObject: GameComponent;

    private _setIntervalID: number;
    private _lastPlatformPosition: number[];
    private _mode: string;

    private _bots: Bot[];
    private _world: GameWorld;

    private _communicator: ServerCommunicator;

    constructor(canvas, mode?) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this._alert = document.querySelector(ALERT_SELECTOR);

        this._lastCollidedObject = null;

        this._setIntervalID = null;
        this._lastPlatformPosition = null;
        this._mode = mode || DEFAULT_MODE;
    }

    public start() {
        this._setListeners();
        this._initWorld();

        const time = MILLISECONDS_PER_SECOND / this._gameConfig.frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);

        if (this._mode === MODES.single) {
            this._createBots();
        } else {
            this._communicator = new ServerCommunicator();
        }
    }

    public stop() {
        clearInterval(this._setIntervalID);
    }

    public continueGame() {
        const time = MILLISECONDS_PER_SECOND / this._gameConfig.frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);
    }

    private _getPlatformByIndex(index) {
        return this._world.platforms[this._getItemIndex(index)];
    }

    private _getUserSectorByIndex(index) {
        return this._world.userSectors[this._getItemIndex(index)];
    }

    /**
     *
     * @param index {number}: index relative to player's one
     * @returns {number} index of the entity which can be obtained cyclically iterating clockwise
     * @private
     */
    private _getItemIndex(index) {
        const result = (this._playerItemsIndex + index) % this._gameConfig.playersNum;

        return result >= 0 ? result : result + this._gameConfig.playersNum;
    }

    private get _playerItemsIndex() {
        return Math.floor(this._gameConfig.playersNum / 2);
    }

    private get _activePlatform() {
        return this._world.platforms[this._playerItemsIndex];
    }

    private get _activeSector() {
        return this._world.userSectors[this._playerItemsIndex];
    }

    private _initWorld() {
        const worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
        const canvasSize = Math.min(this._canvas.width, this._canvas.height);
        const sectorHeight = canvasSize * this._gameConfig.fillFactor / 2;
        const ballRadius = this._gameConfig.ballRelativeRadius * sectorHeight;
        const ballPosition = worldPosition;

        this._world = new GameWorld(this._gameConfig.playersNum, sectorHeight, ballRadius, worldPosition);
        this._world.ball.moveTo(ballPosition);
        this._world.ball.velocity = this._gameConfig.ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    private _setListeners() {
        setInterval(() => this.eventBus.dispatchEvent(events.networkEvents.ClientMessageEvent.create({
            data: 'some data'
        })), 1000); // TODO remove

        this.eventBus.addEventListener(events.networkEvents.DefeatEvent.eventName,
            event => this._handleDefeatEvent(event));

        this.eventBus.addEventListener(events.gameEvents.ClientDefeatEvent.eventName,
            event => this._handleClientDefeatEvent(event));

        this.eventBus.addEventListener(events.gameEvents.ClientDefeatEvent.eventName, event => this._handleClientDefeatEvent(event));

        this.eventBus.addEventListener(
            events.controllerEvents.ArrowDirectionEvent.eventName,
            event => this._platformVelocityDirection = event.detail
        );

        this.eventBus.addEventListener(events.networkEvents.WorldUpdateEvent.eventName, event => this._handleWorldUpdateEvent(event));

        this.eventBus.addEventListener(events.gameEvents.BallBounced.eventName, event => {
            if (event.detail === this._activePlatform.id) {
                this._world.incrementScore();
            }
        });
    }

    private _makeIteration(time) {
        const timeScaleFactor = Math.min(this._canvas.height, this._canvas.width) / this._gameConfig.defaultCanvasSize;
        const scaledTime = time * timeScaleFactor;

        this._world.makeIteration(scaledTime);

        this._handleUserInput(scaledTime);

        const activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }

        this._redraw();
    }

    private _handleUserInput(time: number) {
        const localOffset = math.multiply(this._platformVelocityDirection, this._gameConfig.platformVelocity * time);
        this._world.movePlatform(this._getPlatformByIndex(0), localOffset, math.divide(localOffset, time));

        const offset = localOffset[0];
        if (offset > this._gameConfig.minimalOffset) {
            this._throwPlatformMovedEvent(localOffset[0]);
        }
    }

    private _throwPlatformMovedEvent(platformOffset) {
        /*
         window.dispatchEvent(
         events.PlatformMovedEvent.create(platformOffset)
         );
         */
    }

    private _handleDefeatEvent(event) {
        // TODO сделать что-нибудь поинтереснее
        const sectorId = this._getItemIndex(event.detail);
        if (sectorId === this._playerItemsIndex) {
            this._alert.innerHTML = 'Вы проиграли';
        } else {
            this._alert.innerHTML = 'Вы победили!';
        }
        this._world.userSectors[sectorId].setLoser();
        this._redraw();
        this.stop();
    }

    private _handleClientDefeatEvent(event) {
        const sectorId = event.detail;
        const playerId = this._activeSector.id;

        if (sectorId === playerId) {
            // alert("Вы проиграли");
            this._alert.innerHTML = 'Вы проиграли';
        } else {
            // alert("Вы победили!");
            this._alert.innerHTML = 'Вы победили!';
        }

        this._world.userSectors.filter(sector => sector.id === sectorId).forEach(sector => sector.setLoser());

        this._redraw();
        this.stop();
    }

    private _handleWorldUpdateEvent(event) {
        const gameUpdate = event.detail;

        gameUpdate.platformsUpdate.forEach(platformUpdate => {
            this._getPlatformByIndex(platformUpdate.index).moveTo(platformUpdate.position);
        });

        this._world.updateBallState(gameUpdate.ballUpdate.position, gameUpdate.ballUpdate.velocity);
    }

    private _createBots() {
        this._bots = [1, 2, 3].map(i => new Bot(this._getPlatformByIndex(i), this._world.ball));
    }

    private _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}
