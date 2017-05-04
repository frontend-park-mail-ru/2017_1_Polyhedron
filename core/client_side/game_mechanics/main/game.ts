
import * as math from '../../../_lib/math';
import * as events from '../event_system/events';
import {GameWorld} from './game_world';
import {Bot} from '../ai/bot';
import {GameComponent} from "../base/game_component";
import {EventBus} from "../event_system/event_bus";
import {Autowired, Load} from "../experimental/decorators";
import {Application} from "../experimental/application";
import {ServerCommunicator} from "../network/server_communicator";
import {clientSideServices, serverSideServices} from "../../configs/services";
import {gameEvents, networkEvents} from "../event_system/events";
import TestWorldUpdateEvent = networkEvents.TestWorldUpdateEvent;
import DrawEvent = gameEvents.DrawEvent;
import {Rectangular} from "../drawing/interfaces";
import {getByCircularIndex, revertYAxis} from "../base/common";
import {Platform} from "../game_components/platform";
import {TriangleField} from "../game_components/triangle_field";


const PLATFORM_TOLERANCE = 5;

const MILLISECONDS_PER_SECOND = 1000;

const MODES = {
    single: 'single',
    multi: 'multi',
    server: 'server'
};

const DEFAULT_MODE = MODES.multi;


export class Game {
    @Autowired(EventBus)
    private eventBus: EventBus;

    @Load('game')
    private _gameConfig: any;

    private _field: Rectangular;

    private _platformVelocityDirection: number[] = [0, 0];
    private _lastCollidedObject: GameComponent;

    private _setIntervalID: number;
    private _lastPlatformPosition: number[];
    private _mode: string;

    private _bots: Bot[];
    private _world: GameWorld;

    private _communicator: ServerCommunicator;

    constructor(mode = DEFAULT_MODE) {
        this._field = {
            height: this._gameConfig.fieldSize,
            width: this._gameConfig.fieldSize
        };

        this._lastCollidedObject = null;

        this._setIntervalID = null;
        this._lastPlatformPosition = null;
        this._mode = mode;
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

    public getWorldState() {
        return {
            type: TestWorldUpdateEvent.name,
            data: this._world.getState()
        };
    }

    private _getPlatformByIndex(index): Platform {
        return getByCircularIndex(this._world.platforms, index);
    }

    private _getUserSectorByIndex(index): TriangleField {
        return getByCircularIndex(this._world.userSectors, index);
    }

    private get _activePlatform() {
        return this._world.platforms[0];
    }

    private get _activeSector() {
        return this._world.userSectors[0];
    }

    private _initWorld() {
        const sectorHeight = this._gameConfig.fieldSize * this._gameConfig.fillFactor / 2;
        const ballRadius = this._gameConfig.ballRelativeRadius * sectorHeight;

        this._world = new GameWorld(this._gameConfig.playersNum, sectorHeight, ballRadius);
        this._world.ball.velocity = this._gameConfig.ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    private _setListeners() {
        this.eventBus.addEventListener(
            events.networkEvents.TestWorldUpdateEvent.eventName,
            event => {
                this._world.setState(event.data.detail);
            }
        );

        this.eventBus.addEventListener(events.networkEvents.DefeatEvent.eventName,
            event => this._handleDefeatEvent(event));

        this.eventBus.addEventListener(events.gameEvents.ClientDefeatEvent.eventName,
            event => this._handleClientDefeatEvent(event));

        this.eventBus.addEventListener(
            events.gameEvents.ClientDefeatEvent.eventName,
            event => this._handleClientDefeatEvent(event)
        );

        this.eventBus.addEventListener(
            events.controllerEvents.ArrowDirectionEvent.eventName,
            event => this._platformVelocityDirection = event.detail
        );

        this.eventBus.addEventListener(events.gameEvents.BallBounced.eventName, event => {
            if (event.detail === this._activePlatform.id) {
                this._world.incrementScore();
            }
        });
    }

    private _makeIteration(time) {
        this._world.makeIteration(time);

        this._handleUserInput(time);

        const activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }

        this._redraw();
    }

    private _handleUserInput(time: number) {
        // don't know why, but need to revert velocity
        // TODO find correct way to represent platform velocity
        const velocity = math.multiply(this._platformVelocityDirection, this._gameConfig.platformVelocity);
        const localOffset = math.multiply(this._platformVelocityDirection, this._gameConfig.platformVelocity * time);
        this._world.movePlatform(this._getPlatformByIndex(0), localOffset, velocity);

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
        // TODO replace with server-dependent logic
        // const sectorId = this._getItemIndex(event.detail);
        // if (sectorId === this._playerItemsIndex) {
        //     alert("You lose");
        // } else {
        //     alert("You win");
        // }
        // this._world.userSectors[sectorId].setLoser();
        // this._redraw();
        // this.stop();
    }

    private _handleClientDefeatEvent(event) {
        if (this._mode === MODES.single) {
            const sectorId = event.detail;
            const playerId = this._activeSector.id;

            if (sectorId === playerId) {
                // alert("Вы проиграли");
            } else {
                // alert("Вы победили!");
            }

            this._world.userSectors.filter(sector => sector.id === sectorId).forEach(sector => sector.setLoser());

            this._redraw();
            this.stop();
        }
    }

    private _createBots() {
        this._bots = [1, 2, 3].map(i => new Bot(this._getPlatformByIndex(i), this._world.ball));
    }

    private _redraw() {
        const draw = canvas => {
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
            this._world.getDrawing()(canvas, this._field);
        };

        const event = DrawEvent.create(draw);
        this.eventBus.dispatchEvent(event);
    }
}


@Application(clientSideServices)
export class ClientSideGame extends Game {}


@Application(serverSideServices)
export class ServerSideGame extends Game {}
