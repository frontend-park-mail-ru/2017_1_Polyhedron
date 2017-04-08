
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

    bounce(normVec) {
        let normVec0 = math.divide(normVec, math.norm(normVec));

        let normMatrix = [
            [normVec0[0] * normVec0[0], normVec0[0] * normVec0[1]],
            [normVec0[0] * normVec0[1], normVec0[1] * normVec0[1]]
        ];

        let identityMatrix = math.eye(2);
        let transformMatrix = math.subtract(identityMatrix, math.multiply(normMatrix, 2));

        this.velocity = math.multiply(transformMatrix, this.velocity).toArray();
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
