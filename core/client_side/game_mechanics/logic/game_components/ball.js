
import * as math from '../../../../_lib/math';
import {Circle} from '../geometry_shapes/circle';
import {GameComponent} from './game_component';


export class Ball extends GameComponent {
    constructor(radius) {
        super();
        this._circle = new Circle(radius);
    }

    get radius() {
        return this._circle.radius;
    }

    get shape() {
        return this._circle;
    }

    bounceNorm(normVec, _transportVelocity) {
        const transportVelocity = _transportVelocity ? math.multiply(_transportVelocity, -1) : [0, 0];
        const bounceMatrix = this._getBounceMatrix(normVec);
        const relVelocity = math.subtract(this.velocity, transportVelocity);

        this.velocity = math.add(transportVelocity, math.multiply(bounceMatrix, relVelocity)).toArray();

        //this.velocity = math.multiply(transformMatrix, this.velocity).toArray();
    }

    bouncePoint(point, transportVelocity) {
        console.log(transportVelocity);
        this.bounceNorm(math.subtract(this.position, point), transportVelocity);
    }

    _getBounceMatrix(normVec) {
        const normVec0 = math.divide(normVec, math.norm(normVec));

        const normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];

        const identityMatrix = math.eye(2);
        return math.subtract(identityMatrix, math.multiply(normMatrix, 2));
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
