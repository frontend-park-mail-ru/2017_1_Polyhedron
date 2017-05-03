'use strict';

import {Vector} from "./base_types";
import * as math from "../../../_lib/math";


export interface NewDrawable {
    getDrawing(): (canvas, initialRectangle?: Rectangular) => void;
}


export interface Rectangular {
    height: number;
    width: number;
}


export function toCanvasCS(vec: Vector, canvas: Rectangular, scaleFactor: number = 1) {
    return math.add(
        math.multiply(vec, scaleFactor),
        [canvas.height / 2, canvas.width / 2]
    );
}


export function getCanvasScaleFactor(canvas: Rectangular, initialRectangle?: Rectangular): number {
    if (!initialRectangle) {
        return 1;
    }
    return Math.min(canvas.height, canvas.width) / Math.min(initialRectangle.height, initialRectangle.width);
}


export function specificToCanvasCS(vec: Vector, canvas: Rectangular, initialRectangle?: Rectangular) {
    if (initialRectangle) {
        const scaleFactor = getCanvasScaleFactor(canvas, initialRectangle);
        return toCanvasCS(vec, canvas, scaleFactor);
    } else {
        return toCanvasCS(vec, canvas);
    }
}
