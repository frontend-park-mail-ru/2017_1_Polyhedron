
const math = require('./../../../_lib/math');


export class SolidBody {
    constructor(origin, angle, velocity, angularVelocity) {
        this._origin = origin ? math.matrix(origin) : math.matrix([0, 0]);
        this._angle = angle || 0;
        this._velocity = velocity || [0, 0];
        this._angularVelocity = angularVelocity || 0;
    }

    get position() {
        return this._origin.slice();
    }

    get rotation() {
        return this._angle;
    }

    get velocity() {
        return this._velocity.slice();
    }

    set velocity(velocity) {
        this._velocity = velocity;
    }

    get angularVelocity() {
        return this._angularVelocity;
    }

    set angularVelocity(_angularVelocity) {
        this._angularVelocity = _angularVelocity;
    }

    toLocals(globalCoord) {
        return math.multiply(this._getRotationMatrix(), math.subtract(globalCoord, this._origin)).toArray();
    }

    toLocalsWithoutOffset(globalCoord) {
        return math.multiply(this._getRotationMatrix(), globalCoord).toArray();
    }

    toGlobalsWithoutOffset(localCoord) {
        return math.multiply(this._getInverseRotationMatrix(), localCoord).toArray();
    }

    toGlobals(localCoord) {
        return math.add(math.multiply(this._getInverseRotationMatrix(), localCoord), this._origin).toArray();
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

    _getRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), Math.sin(this._angle)],
            [-Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }

    _getInverseRotationMatrix() {
        return math.matrix([
            [Math.cos(this._angle), -Math.sin(this._angle)],
            [Math.sin(this._angle), Math.cos(this._angle)]
        ]);
    }
}
