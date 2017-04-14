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
            velocity: 5,
            time: MILLISECONDS_PER_SECOND / FRAME_RATE
        },

        platform: {
            relativeDistance: 0.05,
            relativeLength: 0.3,
            width: 5
        },

        game: {
            playersNum: 4,
            frameRate: 100,
            fillFactor: 0.8,
            ballRelativeRadius: 0.08,
            relativeBallOffset: [0.1, 0.05],
            relativeBallVelocity: [0.25, 0.25]
        }
    }
};
