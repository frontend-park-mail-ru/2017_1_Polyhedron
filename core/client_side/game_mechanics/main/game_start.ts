
import {Game, ClientSideGame} from './game';
import {Autowired} from "../experimental/decorators";
import {VariableContext} from "../experimental/context";
import {Drawer} from "../experimental/drawer";


export class GameStarter {
    @Autowired(VariableContext)
    private variableMap: VariableContext;
    private drawer: Drawer;

    public start(canvasId) {
        this.drawer = new Drawer(document.getElementById(canvasId) as HTMLCanvasElement);

        const loop = new ClientSideGame (
            document.getElementById(canvasId)
        );
        this.variableMap.set('loop', loop);

        loop.start();
    }
}
