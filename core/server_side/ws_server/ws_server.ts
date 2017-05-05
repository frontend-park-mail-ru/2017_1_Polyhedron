'use strict';

import * as WebSocket from 'ws';
import {ServerSideGame} from "../../client_side/game_mechanics/main/game";
import * as log4js from 'log4js';
import {getUsersBySession, getUserSession, setSession} from "./session_handling";
import {dispatchMessage, getServerClients} from "./ws_generics";
import {
    GameSessionGenerator, getSessionIndex, getSessionPrefix, rotateGameWorldState,
    UserHolder
} from "./game_related_objects";
import {Autowired} from "../../client_side/game_mechanics/experimental/decorators";
import {GameWorldState} from "../../client_side/game_mechanics/event_system/messages";


class GameServer {
    private static logger = log4js.getLogger('GameServerLogger', 'debug');

    @Autowired(UserHolder)
    private _userHolder: UserHolder;

    @Autowired(GameSessionGenerator)
    private _gameSessionGenerator: GameSessionGenerator;

    private _server: WebSocket.Server;
    private _playerNum: number;
    private _gameMap: Map<string, ServerSideGame>;

    constructor(port: number, playerNum: number) {
        this._playerNum = playerNum;
        this._server = new WebSocket.Server({
            port,
            clientTracking: true
        });

        this._gameMap = new Map();
    }

    public run() {
        this._initServer();
    }

    private _initServer() {
        this._server.on('headers', headers => {
            const session = this._gameSessionGenerator.getSession();
            setSession(headers, session);
        });

        this._server.on('connection', ws => {
            GameServer.logger.debug('Connection established');

            const session = getUserSession(ws);
            this._userHolder.addUser(ws, session);
            const sessionPlayers = this._userHolder.getUsers(session);

            if (this._isCompleteParty(sessionPlayers)) {
                this._dispatchGetReadyMessage(sessionPlayers);
                setTimeout(() => {
                    this._startGame(session);
                    const game = this._gameMap.get(getSessionPrefix(session));
                    const users = this._userHolder.getUsers(session);
                    const initialState = game.getWorldState();
                    this._dispatchGameStartMessage(users, initialState);

                    setInterval(() => {
                        const snapshot = game.getWorldState();
                        this._dispatchWorldUpdate(users, snapshot);
                    }, 20);
                }, 1000);
            }

            ws.on('message', message => {
                const index = getSessionIndex(getUserSession(ws));
                const game = this._gameMap.get(getSessionPrefix(session));
                game.movePlatformByIndex(index, JSON.parse(message).data);
            });
        });
    }

    private _startGame(session: string) {
        const game = new ServerSideGame('server');
        game.init();
        this._gameMap.set(getSessionPrefix(session), game);
        game.start();
    }

    private _dispatchWorldUpdate(wsArray, state: GameWorldState) {
        wsArray.forEach((ws, ind) => {
            const message = JSON.stringify({
                type: 'WorldUpdateEvent',
                data: rotateGameWorldState(state, ind)
            });

            ws.send(message);
        });
    }

    private _dispatchGameStartMessage(wsArray, initialState: GameWorldState) {
        wsArray.forEach((ws, ind) => {
            const message = JSON.stringify({
                type: 'GameStartEvent',
                data: rotateGameWorldState(initialState, ind)
            });

            ws.send(message);
        });

        GameServer.logger.debug('Game started');
    }

    private _dispatchGetReadyMessage(wsArray) {
        const message = JSON.stringify({
            type: 'GetReadyEvent',
            data: 'start'
        });

        dispatchMessage(message, wsArray);
        GameServer.logger.debug('Get ready');
    }

    private _isCompleteParty(wsArray) {
        return wsArray.length > 0 && wsArray.length % this._playerNum === 0;
    }
}

(() => {
    const gameServer = new GameServer(8081, 4);
    gameServer.run();
})();

