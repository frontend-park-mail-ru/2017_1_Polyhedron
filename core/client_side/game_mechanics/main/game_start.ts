
import {Game} from './game';
import {Autowired} from "../experimental/decorators";
import {VariableMap} from "../experimental/context";


export class GameStarter {
    @Autowired(VariableMap)
    private variableMap: VariableMap;

    public start(canvasId) {
        const loop = new Game (
            document.getElementById(canvasId)
        );
        this.variableMap.setVariable('loop', loop);

        loop.start();
    }
}
