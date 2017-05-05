'use strict';

export function dispatchMessage(message: string, wsArray) {
    wsArray.forEach(ws => ws.send(message));
}


export function getServerClients(server) {
    return Array.from(server.clients.values());
}
