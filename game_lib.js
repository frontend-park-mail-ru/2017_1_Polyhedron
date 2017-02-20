
const math = require('mathjs');


class SolidBody {
    constructor(origin, angle, velocity, angularVelocity) {
        this._origin = origin ? math.matrix(origin) : math.matrix([0, 0]);
        this._angle = angle || 0;
        this._velocity = velocity || [0, 0];
        this._angularVelocity = angularVelocity || 0;
    }

    get getPosition() {
        return this._origin.toArray().slice();
    }

    get getRotation() {
        return this._angle;
    }

    get getVelocity() {
        return this._velocity.slice();
    }

    get getAngularVelocity() {
        return this._angularVelocity;
    }

    toLocals(globalCoord) {
        return math.multiply(this._getRotationMatrix, math.subtract(globalCoord, this._origin)).toArray();
    }

    toLocalsWithoutOffset(globalCoord) {
        return math.multiply(this._getRotationMatrix, globalCoord).toArray();
    }

    toGlobalsWithoutOffset(localCoord) {
        return math.multiply(this._getInverseRotationMatrix, localCoord).toArray();
    }

    toGlobals(localCoord) {
        return math.add(math.multiply(this._getInverseRotationMatrix, localCoord), this._origin).toArray();
    }

    moveBy(offset) {
        this._origin = math.add(this._origin, offset);
    }

    moveTo(position) {
        this._origin = position;
    }

    rotateBy(angularOffset) {
        this._angle += angularOffset;
    }

    rotateTo(angle) {
        this._angle = angle;
    }

    get _getRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), Math.sin(this._angle)],
            [-Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }

    get _getInverseRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), -Math.sin(this._angle)],
            [Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }
}


class Circle {
    constructor(radius) {
        this._radius = radius;
    }

    get getRadius() {
        return this._radius;
    }
}


class Triangle {
    constructor(height, sectorAngle) {
        this._height = height;
        this._sectorAngle = sectorAngle;
        this._halfWidth = height * Math.tan(sectorAngle / 2);
    }

    get getPointArray() {
        return [
            [0, 0],
            [-this._height * Math.tan(this._sectorAngle / 2), -this._height],
            [this._height * Math.tan(this._sectorAngle / 2), -this._height],
        ];
    }

    getBottomDistance(point) {
        return point[1] + this._height;
    }

    containsPoint(point) {
        let x = point[0];
        let y = point[1];

        return (y > 0) && (y <= this._height / this._halfWidth * x) && (y <= this._height * (2 - x / this._halfWidth))

    }
}


class Ball extends SolidBody {
    constructor(radius) {
        super();
        this._circle = new Circle(radius);
    }

    get getRadius() {
        return this._circle.getRadius;
    }
}


class TriangleField extends SolidBody {
    constructor(height, sectorAngle, isNeutral) {
        super();
        this._triangle = new Triangle(height, sectorAngle);
        this._isNeutral = isNeutral;
    }

    get getPointArray() {
        return this._triangle.getPointArray.map(point => this.toGlobals(point));
    }

    isNeutral() {
        return this._isNeutral;
    }

    containsGlobalPoint(point) {
        return this._triangle.containsPoint(this.toLocals(point));
    }

    containsLocalPoint(point) {
        return this._triangle.containsPoint(point);
    }

    touchesBottom(ball) {
        let localBallPosition = this.toLocals(ball.getPosition);
        let ballRadius = ball.getRadius();

        return (this.containsLocalPoint(localBallPosition)) &&
            (this._triangle.getBottomDistance(localBallPosition) < ballRadius);
    }

    bumpBall(ball) {
        let localVelocity = this.toLocalsWithoutOffset(ball.getVelocity);
        localVelocity[1] *= -1;
        return this.toGlobalsWithoutOffset(localVelocity);
    }
}


function testCS() {
    let globals = [1, 1];
    let cs = new SolidBody([1, 0], 45 * Math.PI / 180);
    let locals = cs.toLocals(globals);
    let newGlobals = cs.toGlobals(locals);

    console.log(locals);
    console.log(newGlobals);
}

function testTriangle() {
    let triangle = new Triangle(1, 90 * Math.PI / 180);
    console.log(triangle.getPointArray);
}

function testField() {
    let field = new TriangleField(1, 90 * Math.PI / 180);
    field.moveBy([0, -1]);
    field.rotateBy(90 * Math.PI / 180);
    console.log(field.getPointArray);
}

testField();
