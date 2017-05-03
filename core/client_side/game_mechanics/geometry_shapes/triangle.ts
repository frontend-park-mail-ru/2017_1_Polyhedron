

import {Line} from "./line";
import {Point} from "../base/collision_handling";
export class Triangle {
    private _height: number;
    private _sectorAngle: number;
    private _halfWidth: number;

    constructor(height, sectorAngle) {
        this._height = height;
        this._sectorAngle = sectorAngle;
        this._halfWidth = height * Math.tan(sectorAngle / 2);
    }

    public get height(): number {
        return this._height;
    }

    public get halfWidth(): number {
        return this._halfWidth;
    }

    public getPointArray(): number[][] {
        return [
            [0, 0],
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    }

    public getBasePoints(): Point[] {
        return [
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    }

    public contains(point: number[]): boolean {
        const [x, y] = [point[0], point[1] + this.height];
        return this.isInSector(point) && this._aboveBottom(y) && this._inHorRange(x);
    }

    public isInSector(point: number[]): boolean {
        const [x, y] = [point[0], point[1] + this.height];
        return this._underLeftSide(x, y) && this._underRightSide(x, y);
    }

    public getBottomDistance(point): number {
        return point[1] + this._height;
    }

    /**
     *
     * @param bottomDistance
     * @returns number (width of the triangle on the specified distance from bottom)
     */
    public getWidthOnDistance(bottomDistance): number {
        return 2 * (1 - bottomDistance / this._height) * this._halfWidth;
    }

    public scale(scaleFactor) {
        this._height *= scaleFactor;
        this._halfWidth *= scaleFactor;
    }

    private _underLeftSide(x: number, y: number): boolean {
        return y < this.height + x * this.height / this.halfWidth;
    }

    private _underRightSide(x: number, y: number): boolean {
        return y < this.height - x * this.height / this.halfWidth;
    }

    private _aboveBottom(y: number): boolean {
        return y > 0;
    }

    private _inHorRange(x: number): boolean {
        return -this.halfWidth < x && x < this.halfWidth;
    }
}
