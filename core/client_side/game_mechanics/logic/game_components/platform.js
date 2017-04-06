

import {GameComponent} from './game_component';

const DEFAULT_RELATIVE_DISTANCE = 0.05;
const DEFAULT_RELATIVE_LENGTH = 0.3;
const DEFAULT_WIDTH = 5;


export class Platform extends GameComponent {
    constructor(length, width, isActive) {
        super();
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

        const offsetValidator = (offsetVec) => {
            const f1 = (x, y) => y < triangleField.height * (1 - relativeLength) + x * triangleField.height / triangleField.halfWidth;
            const f2 = (x, y) => y < triangleField.height * (1 - relativeLength) - x * triangleField.height / triangleField.halfWidth;
            const f3 = x => -triangleField.halfWidth * (1 - relativeLength) < x && x < triangleField.halfWidth * (1 - relativeLength);

            let [offsetX, offsetY] = offsetVec;
            offsetY *= -1;

            return offsetY > 0 && f1(offsetX, offsetY) && f2(offsetX, offsetY) && f3(offsetX);
        };

        platform.anchor = platform.position.slice();
        platform.positionValidator = ([xOffset, yOffset]) => offsetValidator([xOffset - platform.anchor[0], yOffset - platform.anchor[1]]);

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

        return (this.leftBorder <= checkPoint[0]) && (checkPoint[0] <= this.rightBorder) &&
            (this.lowerBorder <= checkPoint[1]) && (checkPoint[1] <= this.upperBorder);
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
