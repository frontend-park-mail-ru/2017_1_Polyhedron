'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const randomString = require("randomstring");
const game_1 = require("../../client_side/game_mechanics/main/game");
const log4js = require("log4js");
const SESSION_NAME = 'SESSIONID';
function createSession(idLength = 20) {
    return randomString.generate(idLength);
}
function createSessionCookie(session) {
    return SESSION_NAME + '=' + session;
}
function getCookieVal(cookie, key) {
    const result = cookie
        .replace(/\s/g, "")
        .split(';')
        .map(part => part.split('='))
        .filter(([_key, _val]) => _key === key);
    if (result.length === 0) {
        return null;
    }
    else {
        return result[0][1];
    }
}
function getUserSession(ws) {
    return getCookieVal(ws.upgradeReq.headers.cookie, SESSION_NAME);
}
function getUsersBySession(session, wsArray) {
    return wsArray
        .filter(ws => getUserSession(ws) === session);
}
function dispatchMessage(message, wsArray) {
    wsArray.forEach(ws => ws.send(message));
}
function getServerClients(server) {
    return Array.from(server.clients.values());
}
class FakeCanvas {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
}
class GameSessionGenerator {
    constructor(roomSize) {
        this._roomSize = roomSize;
        this._cnt = 0;
    }
    getSession() {
        if (this._cnt % this._roomSize === 0) {
            this._currSession = createSession();
        }
        ++this._cnt;
        return this._currSession;
    }
}
class UserHolder {
    constructor() {
        this._userMap = {};
    }
    static getInstance() {
        return this._userHolder;
    }
    addUser(wsUser, session) {
        if (!(session in this._userMap)) {
            this._userMap[session] = [];
        }
        this._userMap[session].push(wsUser);
    }
    getUsers(session) {
        if (!(session in this._userMap)) {
            return [];
        }
        return this._userMap[session];
    }
}
UserHolder._userHolder = new UserHolder();
class GameServer {
    constructor(port, playerNum) {
        this._playerNum = playerNum;
        this._userHolder = UserHolder.getInstance();
        this._server = new WebSocket.Server({
            port,
            clientTracking: true
        });
        this._gameMap = new Map();
    }
    run() {
        this._initServer();
    }
    _startGame(session) {
        const canvas = new FakeCanvas(100, 100);
        const game = new game_1.Game(canvas, 'server');
        this._gameMap.set(session, game);
        game.start();
    }
    _initServer() {
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
    _dispatchGameStartMessage(wsArray) {
        const message = JSON.stringify({
            type: 'GameStart',
            data: 'start'
        });
        dispatchMessage(message, wsArray);
        GameServer.logger.debug('Game started');
    }
    _isCompleteParty(wsArray) {
        return wsArray.length % this._playerNum === 0;
    }
}
GameServer.logger = log4js.getLogger('GameServerLogger', 'debug');
(() => {
    const gameServer = new GameServer(8081, 4);
    gameServer.run();
})();
//# sourceMappingURL=new_server.js.map