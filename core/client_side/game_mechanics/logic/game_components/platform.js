

import {GameComponent} from './game_component';
import {Rectangle} from '../geometry_shapes/rectangle';
import {Line} from '../geometry_shapes/line';

const DEFAULT_RELATIVE_DISTANCE = 0.05;
const DEFAULT_RELATIVE_LENGTH = 0.3;
const DEFAULT_WIDTH = 5;


export class Platform extends GameComponent {
    constructor(length, width, isActive) {
        super();
        this._rectangle = new Rectangle(length, width);
        this._length = length;
        this._width = width;
        this._isActive = isActive || false;
    }

    static platformFromTriangleField(triangleField, _relativeDistance, _relativeLength, _width) {
        let relativeDistance = _relativeDistance || DEFAULT_RELATIVE_DISTANCE;
        let relativeLength = _relativeLength || DEFAULT_RELATIVE_LENGTH;
        let width = _width || DEFAULT_WIDTH;

        let position = triangleField.toGlobals([0, -triangleField.height * (1 - relativeDistance)]); // using such
        // coordinates because triangleField coordinate system origin is in the topmost corner.
        let rotation = triangleField.rotation;
        let totalLength = triangleField.getWidthOnRelativeDistance(relativeDistance);
        let platformLength = totalLength * relativeLength;

        let platform = new Platform(platformLength, width);
        platform.moveTo(position);
        platform.rotateTo(rotation);

        const offsetValidator = (globalOffsetVec) => {
            return platform.getPointArray()
                .map(([x, y]) => [x + globalOffsetVec[0], y + globalOffsetVec[1]])
                .map(point => triangleField.contains(point))
                .reduce((res, curr) => res && curr, true);
        };

        platform.anchor = platform.position.slice();
        platform.positionValidator = offsetValidator;

        return platform;
    }

    setActive() {
        this._isActive = true;
    }

    setPassive() {
        this._isActive = false;
    }

    getPointArray() {
        return this._rectangle.getPointArray().map(point => this.toGlobals(point));
    }

    getLineArray() {
        const pointArray = this._rectangle.getPointArray().map(point => this.toGlobals(point));
        const indArray = [...Array(pointArray.length).keys()];
        const pointPairArray = indArray
            .map(i => [pointArray[i % pointArray.length], pointArray[(i + 1) % pointArray.length]]);
        return pointPairArray.map(pointPair => new Line(pointPair[0], pointPair[1]));
    }

    get shape() {
        return this._rectangle;
    }

    set optionalPositioningInfo(optionalInfo) {
        this._optionalPositioningInfo = optionalInfo;
    }

    getNorm() {
        return this.toGlobalsWithoutOffset([0, 1]);
    }

    inBounceZone(ball) {
        const lineArray = this.getLineArray();
        const contacted = lineArray.filter(line => line.getClosestPointDistance(ball.position) < ball.radius);

        if (contacted.length === 0) {
            return null;
        }

        return contacted[0];

        const lineDistanceArray = lineArray.map(line => line.getClosestPointDistance(ball.position));
        const inRangeArray = lineDistanceArray.map(distance => distance < ball.radius);

        return inRangeArray.reduce((res, curr) => res || curr, false);
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
