

export class Triangle {
    private _height: number;
    private _sectorAngle: number;
    private _halfWidth: number;

    constructor(height, sectorAngle) {
        this._height = height;
        this._sectorAngle = sectorAngle;
        this._halfWidth = height * Math.tan(sectorAngle / 2);
    }

    get height(): number {
        return this._height;
    }

    get halfWidth(): number {
        return this._halfWidth;
    }

    getPointArray(): number[][] {
        return [
            [0, 0],
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    }

    contains(point): boolean {
        const f1 = (x, y) => y < this.height + x * this.height / this.halfWidth;
        const f2 = (x, y) => y < this.height - x * this.height / this.halfWidth;
        const f3 = x => -this.halfWidth < x && x < this.halfWidth;

        const pointX = point[0];
        const pointY = point[1] + this.height; // move coordinate system origin to the base center
        return pointY > 0 && f1(pointX, pointY) && f2(pointX, pointY) && f3(pointX);
    }

    getBottomDistance(point): number {
        return point[1] + this._height;
    }

    /**
     *
     * @param bottomDistance
     * @returns number (width of the triangle on the specified distance from bottom)
     */
    getWidthOnDistance(bottomDistance): number {
        return 2 * (1 - bottomDistance / this._height) * this._halfWidth;
    }

    scale(scaleFactor) {
        this._height *= scaleFactor;
        this._halfWidth *= scaleFactor;
    }
}
