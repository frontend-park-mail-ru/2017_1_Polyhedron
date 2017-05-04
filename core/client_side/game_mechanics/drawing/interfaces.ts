'use strict';


export interface Drawable {
    getDrawing(): (canvas, initialRectangle?: Rectangular) => void;
}


export interface Rectangular {
    height: number;
    width: number;
}
