
import * as math from '../../../_lib/math';
import {Circle} from '../geometry_shapes/circle';
import {GameComponent} from '../base/game_component';
import {Stateful} from '../experimental/interfaces';
import {CircleCollider} from "../base/collision_handling";
import {BallState} from "../event_system/messages";
import {Drawable, Rectangular} from "../drawing/interfaces";
import {specificToCanvasCS, getCanvasScaleFactor} from "../drawing/canvas_transform";
import {getProjectionMatrix, getReflectionMatrix} from "../base/geometry";


export class Ball extends GameComponent implements CircleCollider, Stateful<BallState>, Drawable {
    private _circle: Circle;

    constructor(radius: number) {
        super();
        this._circle = new Circle(radius);
    }

    public getState(): BallState {
        return {
            velocity: this.velocity,
            position: this.position
        };
    }

    public setState(state: BallState) {
        this._velocity = state.velocity;
        this._origin = state.position;
    }

    public get radius(): number {
        return this._circle.radius;
    }

    public get shape(): Circle {
        return this._circle;
    }

    public bounceNorm(normVec: number[], surfaceVelocity: number[] = [0, 0]) {
        const normSurfaceVelocity = math.multiply(getProjectionMatrix(normVec), surfaceVelocity);
        const relativeVelocity = math.subtract(this.velocity, normSurfaceVelocity);
        const bounceMatrix = getReflectionMatrix(normVec);
        const newRelativeVelocity = math.multiply(bounceMatrix, relativeVelocity);
        this.velocity = math.add(newRelativeVelocity, surfaceVelocity).toArray();
    }

    public bouncePoint(point: number[], transportVelocity: number[]) {
        this.bounceNorm(math.subtract(this.position, point), transportVelocity);
    }

    public getDrawing() {
        return (canvas, initialRectangle?: Rectangular) => {
            const context = canvas.getContext("2d");
            const position = specificToCanvasCS(this.position, canvas, initialRectangle);
            const radius = this.radius * getCanvasScaleFactor(canvas, initialRectangle);

            context.beginPath();
            context.arc(position[0], position[1], radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 1;
            context.stroke();
        };
    }
}
