'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const FRAME_RATE = 60;


export const config = {
    services: [
        //{cls: InputController},
        //{cls: EventBus}
    ],

    dataSources: {
        bot: {
            velocity: 0.1,
            time: MILLISECONDS_PER_SECOND / FRAME_RATE
        },

        platform: {
            relativeDistance: 0.05,
            relativeLength: 0.3,
            aspectRatio: 0.25
        },

        game: {
            defaultCanvasSize: 100,
            playersNum: 4,
            frameRate: FRAME_RATE,
            fillFactor: 0.8,
            ballRelativeRadius: 0.05,
            relativeBallOffset: [0.15, 0.1],
            relativeBallVelocity: [0.02, 0.005],
            ballVelocity: [0.1, 0.025]
        }
    }
}
