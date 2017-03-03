
//const math = require('mathjs');   // Do not delete. This expression is used to debug without browser
const math = require('./_lib/math');
const events = require('./events');

const KEY_LEFT = 39;
const KEY_RIGHT = 37;

const DEFAULT_RELATIVE_DISTANCE = 0.05;
const DEFAULT_RELATIVE_LENGTH = 0.3;
const DEFAULT_WIDTH = 5;

const DEFAULT_PLAYER_NUM = 4;
const DEFAULT_FRAME_RATE = 60;
const DEFAULT_FILL_FACTOR = 0.8;
const DEFAULT_BALL_RELATIVE_RADIUS = 0.05;
const DEFAULT_RELATIVE_BALL_OFFSET = [0.1, 0.05];
const DEFAULT_RELATIVE_BALL_VELOCITY = [0.25, 0.25];

const PLATFORM_TOLERANCE = 5;


class SolidBody {
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


class Circle {
    constructor(radius) {
        this._radius = radius;
    }

    get radius() {
        return this._radius;
    }
}


class Triangle {
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


class Ball extends SolidBody {
    constructor(radius) {
        super();
        this._circle = new Circle(radius);
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
        this._triangle = new Triangle(height, sectorAngle);
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


class GameWorld {
    constructor(userNum, sectorHeight, ballRadius, position) {
        this._userNum = userNum;
        this._sectorAngle = Math.PI / userNum;
        this._sectorHeight = sectorHeight;
        this._ballRadius = ballRadius;
        this._position = position;

        this._userSectors = [];
        this._neutralSectors = [];
        this._platforms = [];
        this._ball = null;

        this._initSectors();
        this._initBall();
        this._initPlatforms();
    }

    get ball() {
        return this._ball;
    }

    get userSectors() {
        return this._userSectors;
    }

    get neutralSectors() {
        return this._neutralSectors;
    }

    get platforms() {
        return this._platforms;
    }

    _initSectors() {
        for (let i = 0; i != this._userNum; ++i) {
            let userSector = new TriangleField(this._sectorHeight, this._sectorAngle, false);
            userSector.rotateBy(2 * this._sectorAngle * i);
            userSector.moveTo(this._position);

            let neutralSector = new TriangleField(this._sectorHeight, this._sectorAngle, true);
            neutralSector.rotateBy(this._sectorAngle * (2 * i + 1));
            neutralSector.moveTo(this._position);

            this._userSectors.push(userSector);
            this._neutralSectors.push(neutralSector);
        }
    }

    _initPlatforms() {
        this._platforms = this._userSectors.map(sector => Platform.platformFromTriangleField(sector)); // using
        // default parameters for platforms
    }

    _initBall() {
        this._ball = new Ball(this._ballRadius);
        this._ball.moveTo(this._position);
    }

    draw(canvas) {
        this._userSectors.forEach(sector => sector.draw(canvas));
        this._neutralSectors.forEach(sector => sector.draw(canvas));
        this._platforms.forEach(platform => platform.draw(canvas));
        this._ball.draw(canvas);
    }
}


class Game {
    constructor(canvas, playerNum, frameRate, fillFactor, ballRelativeRadius,
                initialRelativeBallOffset, initialRelativeBallVelocity) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._playerNum = playerNum || DEFAULT_PLAYER_NUM;
        this._frameRate = frameRate || DEFAULT_FRAME_RATE;
        this._fillFactor = fillFactor || DEFAULT_FILL_FACTOR;
        this._initialRelativeBallOffset = initialRelativeBallOffset || DEFAULT_RELATIVE_BALL_OFFSET;
        this._initialRelativeBallVelocity  = initialRelativeBallVelocity || DEFAULT_RELATIVE_BALL_VELOCITY;
        this._ballRelativeRadius = ballRelativeRadius || DEFAULT_BALL_RELATIVE_RADIUS;

        this._lastCollidedObject = null;

        this._leftPressed = false;
        this._rightPressed = false;

        this._platformVelocityDirection = [0, 0];
        this._setIntervalID = null;
        this._lastPlatformPosition = null;
    }

    start() {
        this._setListeners();
        this._initWorld();

        let time = 1000 / this._frameRate;
        this._setIntervalID = setInterval(() => this._makeIteration(time), time);
    }

    get _activePlatform() {
        return this._world._platforms[Math.floor(this._playerNum / 2)];
    }

    _initWorld() {
        let worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
        let sectorHeight = Math.min(this._canvas.width, this._canvas.height) * this._fillFactor / 2;
        let ballRadius = this._ballRelativeRadius * sectorHeight;
        let ballPosition = math.add(worldPosition, math.multiply(this._initialRelativeBallOffset, sectorHeight));
        let ballVelocity = math.multiply(this._initialRelativeBallVelocity, sectorHeight / this._frameRate);

        this._world = new GameWorld(this._playerNum, sectorHeight, ballRadius, worldPosition);
        this._world.ball.moveTo(ballPosition);   // TODO remove. Now it just moves ball from center
        this._world.ball.velocity = ballVelocity;

        this._activePlatform.setActive();
        this._lastPlatformPosition = this._activePlatform.position.slice();

        this._redraw();
    }

    _setListeners() {
        document.addEventListener("keydown", event => this._handleKeyDown(event), false);
        document.addEventListener("keyup", event => this._handleKeyUp(event), false);
    }

    _makeIteration(time) {
        this._redraw();

        this._world.ball.moveBy(math.multiply(this._world.ball.velocity, time));
        this._handleUserInput();

        this._world.userSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleUserSectorCollision(sector);
            }
        });

        this._world.neutralSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleNeutralSectorCollision(sector, this._world.ball);
            }
        });

        this._world.platforms.forEach(platform => {
            if (platform.inBounceZone(this._world.ball)) {
                this._handlePlatformCollision(platform, this._world.ball);
            }
        });

        let activePlatformOffset = math.subtract(this._activePlatform.position, this._lastPlatformPosition);
        if (math.norm(activePlatformOffset) > PLATFORM_TOLERANCE) {
            this._throwPlatformMovedEvent(activePlatformOffset);
            this._lastPlatformPosition = this._activePlatform.position;
        }
    }

    _stopGameLoop() {
        clearInterval(this._setIntervalID);
    }

    _handleUserSectorCollision(sector) {
        if (sector != this._lastCollidedObject) {
            this._stopGameLoop();
            sector.setLoser();
            this._redraw();
        }
    }

    _handleNeutralSectorCollision(sector, ball) {
        if (sector != this._lastCollidedObject) {
            ball.bounce(sector.getBottomNorm());
            this._lastCollidedObject = sector;
        }
    }

    _handlePlatformCollision(platform, ball) {
        if (platform != this._lastCollidedObject) {
            ball.bounce(platform.getNorm());
            this._lastCollidedObject = platform;
        }
    }

    _handleKeyDown(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = true;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = true;
        }
        this._updatePlatformVelocityDirection();
    }

    _handleKeyUp(event) {
        if (event.keyCode == KEY_LEFT) {
            this._leftPressed = false;
        } else if (event.keyCode == KEY_RIGHT) {
            this._rightPressed = false;
        }
        this._updatePlatformVelocityDirection();
    }

    _updatePlatformVelocityDirection() {
        if (!this._leftPressed && !this._rightPressed) {
            this._platformVelocityDirection = [0, 0];
        } else if (this._leftPressed && !this._rightPressed) {
            this._platformVelocityDirection = [-1, 0];
        } else if (!this._leftPressed && this._rightPressed) {
            this._platformVelocityDirection = [1, 0];
        } else {
            this._platformVelocityDirection = [0, 0];
        }
    }

    _handleUserInput () {
        // TODO refactor. Just testing
        this._world.platforms.forEach(platform => {
            let platformVelocity = 0.5;

            let originalPosition = platform.optionalPositioningInfo.originalPosition;
            let offsetVec = math.subtract(platform.position, originalPosition);

            let localStep = math.multiply(this._platformVelocityDirection, platformVelocity);

            let globalStep = platform.toGlobalsWithoutOffset(localStep);
            let newOffsetVec = math.add(globalStep, offsetVec);

            if (math.norm(newOffsetVec) <= platform.optionalPositioningInfo.maxOffset) {
                platform.moveBy(globalStep);
            }
        });
    }

    _throwPlatformMovedEvent(platformOffset) {
        document.dispatchEvent(
            new events.PlatformMovedEvent(platformOffset)
        );
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
    }
}


module.exports.Game = Game;

