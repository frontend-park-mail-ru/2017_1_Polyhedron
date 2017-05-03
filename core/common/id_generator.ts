'use strict';

export function getIdGenerator() {
    let id = 0;
    return () => ++id;
}
