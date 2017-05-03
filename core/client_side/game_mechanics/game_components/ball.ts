
import * as math from '../../../_lib/math';
import {Circle} from '../geometry_shapes/circle';
import {GameComponent} from '../base/game_component';
import {NewDrawable, Serializable} from '../experimental/interfaces';
import {CircleCollider} from "../base/collision_handling";
import {BallState} from "../event_system/messages";


export class Ball extends GameComponent implements CircleCollider, Serializable<BallState>, NewDrawable {
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
        surfaceVelocity = math.multiply(surfaceVelocity, -1);
        const relativeVelocity = math.subtract(this.velocity, surfaceVelocity);
        const bounceMatrix = this._getBounceMatrix(normVec);
        const newRelativeVelocity = math.multiply(bounceMatrix, relativeVelocity);
        this.velocity = math.add(newRelativeVelocity, surfaceVelocity).toArray();
    }

    public bouncePoint(point: number[], transportVelocity: number[]) {
        this.bounceNorm(math.subtract(this.position, point), transportVelocity);
    }

    public getDrawing() {
        return (canvas) => {
            const context = canvas.getContext("2d");
            const position = this.position;

            context.beginPath();
            context.arc(position[0], position[1], this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 1;
            context.stroke();
        };
    }

    private _getBounceMatrix(normVec: number[]) {
        const normVec0 = math.divide(normVec, math.norm(normVec));

        const normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];

        const identityMatrix = math.eye(2);
        return math.subtract(identityMatrix, math.multiply(normMatrix, 2));
    }
}
