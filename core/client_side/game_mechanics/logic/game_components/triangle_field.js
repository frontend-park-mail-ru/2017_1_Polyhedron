

import * as shapes from '../geometry_shapes';
import {SolidBody} from '../solid_body';


export class TriangleField extends SolidBody {
    constructor(height, sectorAngle, isNeutral) {
        super();
        this._triangle = new shapes.Triangle(height, sectorAngle);
        this._isNeutral = isNeutral;
        this._isLoser = false;
    }

    get height() {
        return this._triangle.height;
    }

    get halfWidth() {
        return this._triangle.halfWidth;
    }

    getPointArray() {
        return this._triangle.getPointArray().map(point => this.toGlobals(point));
    }

    getBottomNorm() {
        return this.toGlobalsWithoutOffset([0, 1]);
    }

    isNeutral() {
        return this._isNeutral;
    }

    isLoser() {
        return this._isLoser;
    }

    setLoser() {
        this._isLoser = true;
    }

    containsGlobalPoint(point) {
        return this._triangle.containsPoint(this.toLocals(point));
    }

    containsLocalPoint(point) {
        return this._triangle.containsPoint(point);
    }

    reachesBottomLevel(ball) {
        let localBallPosition = this.toLocals(ball.position);
        let ballRadius = ball.radius;

        return this._triangle.getBottomDistance(localBallPosition) < ballRadius;
    }

    getWidthOnDistance(bottomDistance) {
        return this._triangle.getWidthOnDistance(bottomDistance);
    }

    getWidthOnRelativeDistance(relativeDistance) {
        return this._triangle.getWidthOnDistance(relativeDistance * this._triangle.height);
    }

    draw(canvas) {
        let context = canvas.getContext("2d");
        let points = this.getPointArray();

        context.beginPath();
        for (let i = 0; i != points.length; ++i) {
            if (i === 0) {
                context.moveTo(points[i][0], points[i][1]);
            } else {
                context.lineTo(points[i][0], points[i][1]);
            }
        }
        context.closePath();

        let fillStyle = null;
        if (this.isNeutral()) {
            fillStyle = 'white';
        } else if (this.isLoser()) {
            fillStyle = 'blue';
        } else {
            fillStyle = 'red';
        }
        context.fillStyle = fillStyle;
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}
