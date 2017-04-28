
import {Game} from './game';


export function startGame(canvasId) {
    (window as any).loop = new Game (
        document.getElementById(canvasId)
    );
    (window as any).loop.start();
}
