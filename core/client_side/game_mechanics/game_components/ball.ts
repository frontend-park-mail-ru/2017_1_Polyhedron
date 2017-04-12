
import * as math from '../../../_lib/math';
import {Circle} from '../geometry_shapes/circle';
import {GameComponent} from '../base/game_component';
import {Drawable} from '../experimental/interfaces';


export class Ball extends GameComponent implements Drawable {
    private _circle: Circle;

    constructor(radius: number) {
        super();
        this._circle = new Circle(radius);
    }

    get radius(): number {
        return this._circle.radius;
    }

    get shape(): Circle {
        return this._circle;
    }

    bounceNorm(normVec: number[], _transportVelocity: number[] = [0, 0]) {
        const transportVelocity = math.multiply(_transportVelocity, -1);
        const bounceMatrix = this._getBounceMatrix(normVec);
        const relVelocity = math.subtract(this.velocity, transportVelocity);

        this.velocity = math.add(transportVelocity, math.multiply(bounceMatrix, relVelocity)).toArray();
    }

    bouncePoint(point: number[], transportVelocity: number[]) {
        this.bounceNorm(math.subtract(this.position, point), transportVelocity);
    }

    _getBounceMatrix(normVec: number[]) {
        const normVec0 = math.divide(normVec, math.norm(normVec));

        const normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];

        const identityMatrix = math.eye(2);
        return math.subtract(identityMatrix, math.multiply(normMatrix, 2));
    }

    draw(canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        const position = this.position;

        context.beginPath();
        context.arc(position[0], position[1], this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 1;
        context.stroke();
    }
}
