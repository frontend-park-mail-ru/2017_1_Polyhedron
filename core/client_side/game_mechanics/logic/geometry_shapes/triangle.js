

export class Triangle {
    constructor(height, sectorAngle) {
        this._height = height;
        this._sectorAngle = sectorAngle;
        this._halfWidth = height * Math.tan(sectorAngle / 2);
    }

    get height() {
        return this._height;
    }

    get halfWidth() {
        return this._halfWidth;
    }

    getPointArray() {
        return [
            [0, 0],
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    }

    contains(point) {
        const f1 = (x, y) => y < this.height + x * this.height / this.halfWidth;
        const f2 = (x, y) => y < this.height - x * this.height / this.halfWidth;
        const f3 = x => -this.halfWidth < x && x < this.halfWidth;

        //let [offsetX, offsetY] = offsetVec;
        //offsetY *= -1;

        const pointX = point[0];
        const pointY = point[1] + this.height; // move coordinate system origin to the base center
        return pointY > 0 && f1(pointX, pointY) && f2(pointX, pointY) && f3(pointX);
    }

    getBottomDistance(point) {
        return point[1] + this._height;
    }

    /**
     *
     * @param bottomDistance
     * @returns number (width of the triangle on the specified distance from bottom)
     */
    getWidthOnDistance(bottomDistance) {
        return 2 * (1 - bottomDistance / this._height) * this._halfWidth;
    }

    containsPoint(point) {
        // offsets below move coordinate system origin to the lower left corner
        // because it is easier to write conditions in this coordinate system
        let x = point[0] + this._halfWidth;
        let y = point[1] + this._height;

        return (y > 0) && (y <= this._height / this._halfWidth * x) && (y <= this._height * (2 - x / this._halfWidth));
    }
}