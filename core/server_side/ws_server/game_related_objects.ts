'use strict';

import {createSession} from "./session_handling";


export class GameSessionGenerator {
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


export class UserHolder {
    private static _userHolder: UserHolder = new UserHolder();
    private _userMap: {};

    constructor() {
        this._userMap = {};
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
}


export class FakeCanvas {
    public height: number;
    public width: number;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;
    }
}


