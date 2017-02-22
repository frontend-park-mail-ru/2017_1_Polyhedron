
//const math = require('mathjs');


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

    containsPoint(point) {
        // offsets below move coordinate system origin to the lower left corner
        // because it is easier to write conditions in this coordinate system
        let x = point[0] + this._halfWidth;
        let y = point[1] + this._height;

        return (y > 0) && (y <= this._height / this._halfWidth * x) && (y <= this._height * (2 - x / this._halfWidth))

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
    constructor(length, width) {
        super();
        this._length = length;
        this._width = width;
    }

    getPointArray() {
        return [
            [this.leftBorder, this.lowerBorder],
            [this.rightBorder, this.lowerBorder],
            [this.rightBorder, this.upperBorder],
            [this.leftBorder, this.upperBorder],
        ].map(point => this.toGlobals(math.add(point, this.position)))
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


    inBounceZone(ball) {
        let localBallPosition = this.toLocals(ball.position);

        let checkPoint = [
            localBallPosition[0], localBallPosition[1] - ball.radius()
        ];

        return this.lowerBorder <= checkPoint[0] <= this.upperBorder &&
            this.leftBorder <= checkPoint[1] <= this.rightBorder;
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

        context.fillStyle = 'blue';
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

    containsGlobalPoint(point) {
        return this._triangle.containsPoint(this.toLocals(point));
    }

    containsLocalPoint(point) {
        return this._triangle.containsPoint(point);
    }

    reachesBottomLevel(ball) {
        let localBallPosition = this.toLocals(ball.position);
        let ballRadius = ball.radius;

        return this._triangle.getBottomDistance(localBallPosition) < ballRadius
    }


    draw(canvas) {
        let context = canvas.getContext("2d");
        let points = this.getPointArray();

        context.beginPath();
        for (let i = 0; i != points.length; ++i) {
            if (i == 0) {
                context.moveTo(points[i][0], points[i][1]);
            } else {
                context.lineTo(points[i][0], points[i][1]);
            }
        }
        context.closePath();

        //context.fillStyle = 'blue';
        context.fillStyle = this.isNeutral() ? 'white': 'red';
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
        this._ball = null;

        this._initSectors();
        this._initBall();
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

    _initBall() {
        this._ball = new Ball(this._ballRadius);
        this._ball.moveTo(this._position);
    }

    draw(canvas) {
        this._userSectors.forEach(sector => sector.draw(canvas));
        this._neutralSectors.forEach(sector => sector.draw(canvas));
        this._ball.draw(canvas);
    }
}


class GameLoop {
    constructor(canvas, playerNum, sectorHeight, ballRadius) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._lastSector = null;
        this._playerNum = playerNum;
        this._sectorHeight = sectorHeight;
        this._ballRadius = ballRadius;

        this._worldPosition = [this._canvas.width / 2, this._canvas.height / 2];
    }

    start() {
        this._initWorld();

        let time = 10;
        setInterval(() => this._makeIteration(time), time);
    }

    _initWorld() {
        this._world = new GameWorld(this._playerNum, this._sectorHeight, this._ballRadius, this._worldPosition);
        this._world.ball.moveTo([this._worldPosition[0] - 50, this._worldPosition[1]]);   // TODO remove. Now it just moves ball from center
        this._world.ball.velocity = [0, 0.10];   // TODO make velocity outer parameter

        this._redraw();
    }

    _makeIteration(time) {
        this._world.ball.moveBy(math.multiply(this._world.ball.velocity, time));

        this._world.userSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleCollision(sector, this._world.ball);
            }
        });

        this._world.neutralSectors.forEach(sector => {
            if (sector.containsGlobalPoint(this._world.ball.position) && sector.reachesBottomLevel(this._world.ball)) {
                this._handleCollision(sector, this._world.ball);
            }
        });

        this._redraw();
    }

    _handleCollision(sector, ball) {
        if (sector != this._lastSector) {
            ball.bounce(sector.getBottomNorm());
            this._lastSector = sector;
        }
    }

    _redraw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._world.draw(this._canvas);
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
    console.log(triangle.getPointArray());
}

function testContainsGlobal() {
    let triangleField = new TriangleField(100, Math.PI / 4, true);
    //console.log(triangleField.getPointArray());
    console.log(triangleField.containsGlobalPoint([-10, -30]));
}

function testField() {
    let field = new TriangleField(1, 90 * Math.PI / 180);
    field.moveBy([0, -1]);
    field.rotateBy(90 * Math.PI / 180);
    console.log(field.getPointArray());
}

function testBounce() {
    let ball = new Ball(100);
    ball.velocity = [-100, 0];
    console.log(ball.velocity);
    ball.bounce([1, -1]);
    console.log(ball.velocity);
    ball.bounce([-1, 1]);
    console.log(ball.velocity);
}


//testCS();
//testTriangle();
//testField();
//testBounce();

//testContainsGlobal();

