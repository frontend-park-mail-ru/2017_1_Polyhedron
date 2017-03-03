
const game = require('./game');

const CANVAS_ID = "game";
const PLAYER_NUM = 4;
const FRAME_RATE = 60;
const CANVAS_FILL_FACTOR = 0.8;                         // game field height divided by minimal canvas dimension
const BALL_RELATIVE_RADIUS = 0.05;                      // ball radius divided by triangle sector height
const INITIAL_RELATIVE_BALL_OFFSET = [0.25, 0.25];      // ball offset in both directions divided by sector height
const INITIAL_RELATIVE_BALL_VELOCITY = [0.01, 0.04];    // ball velocity divided by product of sector height and frame rate


(function () {
    let loop = new game.Game(
        document.getElementById(CANVAS_ID),
        PLAYER_NUM, FRAME_RATE, CANVAS_FILL_FACTOR, BALL_RELATIVE_RADIUS,
        INITIAL_RELATIVE_BALL_OFFSET, INITIAL_RELATIVE_BALL_VELOCITY
    );
    loop.start();
})();
