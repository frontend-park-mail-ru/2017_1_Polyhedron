
import {Game} from './game';


export function startGame(canvasId) {
    (<any>window).loop = new Game(
        document.getElementById(canvasId)
    );
    (<any>window).loop.start();
}
