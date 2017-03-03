
const math = require('./_lib/math');
const shapes = require('./geometry_shapes');
const SolidBody = require('./solid_body').SolidBody;

const DEFAULT_RELATIVE_DISTANCE = 0.05;
const DEFAULT_RELATIVE_LENGTH = 0.3;
const DEFAULT_WIDTH = 5;


class Ball extends SolidBody {
    constructor(radius) {
        super();
        this._circle = new shapes.Circle(radius);
    }

    get radius() {
        return this._circle.radius;
    }

    bounce(normVec) {
        let normVec0 = math.divide(normVec, math.norm(normVec));

        let normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];

        let identityMatrix = math.eye(2);

        let transformMatrix = math.subtract(identityMatrix, math.multiply(normMatrix, 2));

        let newVelocity = math.multiply(transformMatrix, this.velocity).toArray();
        newVelocity.forEach(x => -x);

        this.velocity = newVelocity;
    }

    draw(canvas) {
        let context = canvas.getContext("2d");
        let position = this.position;
        context.beginPath();
        context.arc(position[0], position[1], this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}


class Platform extends SolidBody {
    constructor(length, width, isActive) {
        super();
        this._length = length;
        this._width = width;
        this._isActive = isActive || false;

        this._optionalPositioningInfo = null;   // extra info necessary to make positioning inside another object
    }

    static platformFromTriangleField(triangleField, _relativeDistance, _relativeLength, _width) {
        let relativeDistance = _relativeDistance || DEFAULT_RELATIVE_DISTANCE;
        let relativeLength = _relativeLength || DEFAULT_RELATIVE_LENGTH;
        let width = _width || DEFAULT_WIDTH;

        let position = triangleField.toGlobals([0, triangleField.height * (relativeDistance - 1)]); // using such
        // coordinates because triangleField coordinate system origin is in the topmost corner.
        let rotation = triangleField.rotation;
        let totalLength = triangleField.getWidthOnRelativeDistance(relativeDistance);
        let platformLength = totalLength * relativeLength;

        let platform = new Platform(platformLength, width);
        platform.moveTo(position);
        platform.rotateTo(rotation);

        platform.optionalPositioningInfo = {
            "originalPosition": platform.position.slice(),
            "maxOffset": totalLength * (1 - relativeLength) / 2
        };

        return platform;
    }

    setActive() {
        this._isActive = true;
    }

    setPassive() {
        this._isActive = false;
    }

    getPointArray() {
        return [
            [this.leftBorder, this.lowerBorder],
            [this.rightBorder, this.lowerBorder],
            [this.rightBorder, this.upperBorder],
            [this.leftBorder, this.upperBorder],
        ].map(point => this.toGlobals(point));
    }

    get leftBorder() {
        return -this._length / 2;
    }

    get rightBorder() {
        return this._length / 2;
    }

    get lowerBorder() {
        return -this._width / 2;
    }

    get upperBorder() {
        return this._width / 2;
    }

    get optionalPositioningInfo() {
        return this._optionalPositioningInfo;
    }

    set optionalPositioningInfo(optionalInfo) {
        this._optionalPositioningInfo = optionalInfo;
    }

    getNorm() {
        return this.toGlobalsWithoutOffset([0, 1]);
    }

    inBounceZone(ball) {
        let localBallPosition = this.toLocals(ball.position);

        let checkPoint = [
            localBallPosition[0], localBallPosition[1] - ball.radius
        ];

        let result = true;
        result = result && this.leftBorder <= checkPoint[0];
        result = result && checkPoint[0] <= this.rightBorder;
        result = result && this.lowerBorder <= checkPoint[1];
        result = result && checkPoint[1] <= this.upperBorder;

        return result;
    }

    draw(canvas) {
        let context = canvas.getContext("2d");
        let points = this.getPointArray();
        context.beginPath();

        context.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i != points.length; ++i) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();

        context.fillStyle = this._isActive ? 'green' : 'blue';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}


class TriangleField extends SolidBody {
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


module.exports.Platform = Platform;
module.exports.TriangleField = TriangleField;
module.exports.Ball = Ball;