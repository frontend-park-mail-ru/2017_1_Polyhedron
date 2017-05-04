'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const MILLISECONDS_PER_SECOND = 1000;
const FRAME_RATE = 60;
exports.config = {
    services: [],
    dataSources: {
        bot: {
            velocity: 0.15,
            time: MILLISECONDS_PER_SECOND / FRAME_RATE
        },
        platform: {
            relativeDistance: 0.05,
            relativeLength: 0.3,
            aspectRatio: 0.25
        },
        game: {
            fieldSize: 100,
            playersNum: 4,
            frameRate: FRAME_RATE,
            fillFactor: 0.8,
            ballRelativeRadius: 0.05,
            // relativeBallOffset: [0.15, 0.1],
            // relativeBallVelocity: [0.01, 0.005],
            ballVelocity: [0.00, 0.08],
            platformVelocity: 0.03,
            minimalOffset: 1,
            platformCollisionAccuracy: 1,
            sectorCollisionAccuracy: 0.5
        },
        network: {
            wsUrl: "ws://localhost:8081"
        }
    }
};
//# sourceMappingURL=dataSources.js.map