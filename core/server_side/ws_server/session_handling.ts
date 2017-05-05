'use strict';

import * as randomString from 'randomstring';


const SESSION_NAME = 'SESSIONID';


export function setSession(headers, session: string) {
    headers.push('Set-Cookie: ' + createSessionCookie(session));
}


export function createSession(idLength: number = 20) {
    return randomString.generate(idLength);
}


export function createSessionCookie(session: string) {
    return SESSION_NAME + '=' + session;
}


export function getUsersBySession(session, wsArray) {
    return wsArray
        .filter(ws => getUserSession(ws) === session);
}


export function getUserSession(ws): string {
    return getCookieVal(
        ws.upgradeReq.headers.cookie,
        SESSION_NAME
    );
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
