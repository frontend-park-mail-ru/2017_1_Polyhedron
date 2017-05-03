'use strict';

import * as WebSocket from 'ws';
import {ServerSideGame} from "../../client_side/game_mechanics/main/game";
import * as log4js from 'log4js';
import {createSession, getUsersBySession, getUserSession} from "./session_handling";
import {dispatchMessage, getServerClients} from "./ws_generics";
import {FakeCanvas, UserHolder} from "./game_related_objects";
import {Autowired} from "../../client_side/game_mechanics/experimental/decorators";


class GameServer {
    private static logger = log4js.getLogger('GameServerLogger', 'debug');

    @Autowired(UserHolder)
    private _userHolder: UserHolder;
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

    private _startGame(session: string) {
        const canvas = new FakeCanvas(100, 100);
        const game = new ServerSideGame(canvas, 'server');
        this._gameMap.set(session, game);
        game.start();
    }

    private _initServer() {
        this._server.on('connection', ws => {
            GameServer.logger.debug('Connection established');

            const session = getUserSession(ws);
            this._userHolder.addUser(ws, session);
            const sessionPlayers = getUsersBySession(session, getServerClients(this._server));

            if (this._isCompleteParty(sessionPlayers)) {
                this._dispatchGameStartMessage(sessionPlayers);
                this._startGame(session);

                setInterval(() => {
                    const users = getUsersBySession(session, getServerClients(this._server));
                    const game = this._gameMap.get(session);
                    const snapshot = game.getWorldSnapshotMessage();
                    dispatchMessage(JSON.stringify(snapshot), users);
                }, 100);
            }
        });
    }

    private _dispatchGameStartMessage(wsArray) {
        const message = JSON.stringify({
            type: 'GameStart',
            data: 'start'
        });

        dispatchMessage(message, wsArray);
        GameServer.logger.debug('Game started');
    }

    private _isCompleteParty(wsArray) {
        return wsArray.length % this._playerNum === 0;
    }
}

(() => {
    const gameServer = new GameServer(8081, 4);
    gameServer.run();
})();

