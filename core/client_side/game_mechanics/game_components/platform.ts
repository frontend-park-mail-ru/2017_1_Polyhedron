'use strict';


import {GameComponent} from '../base/game_component';
import {Rectangle} from '../geometry_shapes/rectangle';
import {Line} from '../geometry_shapes/line';
import * as math from '../../../_lib/math';
import {getIdGenerator} from '../../../common/id_generator';
import {Drawable} from "../experimental/interfaces";
import {PolygonObstacle} from "../base/collision_handling";


export class Platform extends GameComponent implements Drawable, PolygonObstacle {
    private static generateId = getIdGenerator();
    public readonly id: number;
    private _rectangle: Rectangle;
    private _isActive: boolean;


    constructor(length, width, isActive = false) {
        super();
        this._rectangle = new Rectangle(length, width);
        this._isActive = isActive;

        this.id = Platform.generateId();
    }

    public setActive(isActive: boolean = true) {
        this._isActive = isActive;
    }

    public getPointArray() {
        return this._rectangle.getPointArray().map(point => this.toGlobals(point));
    }

    public getLineArray() {
        const pointArray = this._rectangle.getPointArray().map(point => this.toGlobals(point));
        const pointPairArray = pointArray
            .map((point: number[], i: number, arr: number[][]) => [arr[i % arr.length], arr[(i + 1) % arr.length]]);

        return pointPairArray.map(pointPair => new Line(pointPair[0], pointPair[1]));
    }

    public get shape() {
        return this._rectangle;
    }

    public getClosestPoint(origin: number[]) {
        return this.getLineArray()
            .map(line => line.getClosestPoint(origin))
            .map(point => {
                return {
                    point,
                    distance: math.norm(math.subtract(point, origin))
                };
            })
            .sort((obj1, obj2) => obj1.distance - obj2.distance)[0].point;
    }

    public getBouncePoint(ball) {
        const lineArray = this.getLineArray();

        const pointsData = lineArray
            .map(line => line.getClosestPoint(ball.position))
            .map(point => {
                return {
                    point,
                    distance: math.norm(math.subtract(point, ball.position))
                };
            })
            .filter(obj => obj.distance <= ball.radius);

        if (pointsData.length === 0) {
            return null;
        }

        return pointsData
            .sort((obj1, obj2) => obj1.distance - obj2.distance)[0].point;
    }

    public draw(canvas) {
        const context = canvas.getContext("2d");
        const points = this.getPointArray();
        context.beginPath();

        context.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i !== points.length; ++i) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();

        context.fillStyle = this._isActive ? 'green' : 'blue';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}
