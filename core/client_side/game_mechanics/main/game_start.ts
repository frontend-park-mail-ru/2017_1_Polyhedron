
import {Game, ClientSideGame} from './game';
import {Autowired} from "../experimental/decorators";
import {VariableContext} from "../experimental/context";


export class GameStarter {
    @Autowired(VariableContext)
    private variableMap: VariableContext;

    public start(canvasId) {
        const loop = new ClientSideGame (
            document.getElementById(canvasId)
        );
        this.variableMap.set('loop', loop);

        loop.start();
    }
}
