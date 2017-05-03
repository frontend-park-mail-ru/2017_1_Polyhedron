'use strict';

import * as WebSocket from 'ws';
import * as randomString from 'randomstring';
import {Game, ServerSideGame} from "../../client_side/game_mechanics/main/game";
import * as log4js from 'log4js';


const SESSION_NAME = 'SESSIONID';


function createSession(idLength: number = 20) {
    return randomString.generate(idLength);
}


function createSessionCookie(session: string) {
    return SESSION_NAME + '=' + session;
}


function getCookieVal(cookie: string, key: string): string {
    const result = cookie
        .replace(/\s/g, "")
        .split(';')
        .map(part => part.split('='))
        .filter(([_key, _val]) => _key === key);

    if (result.length === 0) {
        return null;
    } else {
        return result[0][1];
    }
}


function getUserSession(ws): string {
    return getCookieVal(
        ws.upgradeReq.headers.cookie,
        SESSION_NAME
    );
}


function getUsersBySession(session, wsArray) {
    return wsArray
        .filter(ws => getUserSession(ws) === session);
}


function dispatchMessage(message: string, wsArray) {
    wsArray.forEach(ws => ws.send(message));
}


function getServerClients(server) {
    return Array.from(server.clients.values());
}


class FakeCanvas {
    public height: number;
    public width: number;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;
    }
}


class GameSessionGenerator {
    private _roomSize: number;
    private _currSession: string;
    private _cnt: number;

    constructor(roomSize) {
        this._roomSize = roomSize;
        this._cnt = 0;
    }

    public getSession(): string {
        if (this._cnt % this._roomSize === 0) {
            this._currSession = createSession();
        }

        ++this._cnt;
        return this._currSession;
    }
}


class UserHolder {
    private static _userHolder: UserHolder = new UserHolder();
    private _userMap: {};

    public static getInstance(): UserHolder {
        return this._userHolder;
    }

    public addUser(wsUser, session) {
        if (!(session in this._userMap)) {
            this._userMap[session] = [];
        }

        this._userMap[session].push(wsUser);
    }

    public getUsers(session: string) {
        if (!(session in this._userMap)) {
            return [];
        }

        return this._userMap[session];
    }

    private constructor() {
        this._userMap = {};
    }
}


class GameServer {
    private static logger = log4js.getLogger('GameServerLogger', 'debug');

    private _userHolder: UserHolder;
    private _server: WebSocket.Server;
    private _playerNum: number;
    private _gameMap: Map<string, Game>;

    constructor(port: number, playerNum: number) {
        this._playerNum = playerNum;
        this._userHolder = UserHolder.getInstance();
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
        const game = new Game(canvas, 'server');
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

