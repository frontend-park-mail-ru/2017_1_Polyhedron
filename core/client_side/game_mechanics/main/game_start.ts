
import {ClientSideGame} from './game';
import {Autowired} from "../experimental/decorators";
import {VariableContext} from "../experimental/context";
import {Drawer, FullScreenDrawer} from "../drawing/drawer";


export class GameStarter {
    @Autowired(VariableContext)
    private variableMap: VariableContext;
    private drawer: Drawer;

    public start(canvasId) {
        this.drawer = new FullScreenDrawer(document.getElementById(canvasId) as HTMLCanvasElement);

        const loop = new ClientSideGame();
        this.variableMap.set('loop', loop);

        loop.start();
    }
}
