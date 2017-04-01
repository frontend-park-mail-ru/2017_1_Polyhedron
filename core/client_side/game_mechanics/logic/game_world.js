
import {TriangleField, Ball, Platform} from './game_components';

export class GameWorld {
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
