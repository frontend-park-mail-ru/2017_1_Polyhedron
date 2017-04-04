

gameUpdate = {
    platformsUpdate: [{
        index: 1,
        position: [0, 0]
    }],

    ballUpdate: {
        position: [0, 0],
        velocity: [100, 100]
    }
};

/*
export class GameUpdate {
    constructor(playerIndex, playerNum) {
        this._playerIndex = playerIndex;
        this._playerNum = playerNum;

        this._platformsUpdate = [];
        this._ballUpdate = null;
    }

    get playerIndex() {
        return this._playerIndex;
    }

    get playerNum() {
        return this._playerNum;
    }

    getPlatformsUpdate() {
        return this._platformsUpdate;
    }

    getBallUpdate() {
        return this._ballUpdate;
    }

    addPlatformUpdate(platformIndex, newPosition) {
        if (!newPosition) {
            return;
        }

        this._platformsUpdate.add({
            index: platformIndex,
            position: newPosition
        });
    }

    setBallUpdate(newPosition, newVelocity) {
        this._ballUpdate = {
            position: newPosition,
            velocity: newVelocity
        };
    }
}
*/