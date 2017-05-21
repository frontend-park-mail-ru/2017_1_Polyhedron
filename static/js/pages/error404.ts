'use strict';
import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";

export class Error extends BasePage {
    private text: Text;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.text = new Text({
            items: [
                {text: 'Запрашиваемая страница не найдена.'},
                {text: 'Пожалуйста, вернитесь в  меню и попробуйте еще раз!'},
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Ошибка";
        this.variableMap.get('userpanel').set_options(false, false, false);
        this.variableMap.get('userpanel').render();
        this.text.render();
    }
}
