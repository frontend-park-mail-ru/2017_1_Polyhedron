'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class About extends BasePage {
    private text: Text;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, alert, options?) {
        super(heading, content, alert, options);
        this.text = new Text({
            items: [
                {text: 'Наша игра - сетевой пинг-понг для четырёх пользователей.'},
                {text: 'Мы используем JavaScript + Java.'},
                {text: 'Проект является семестровым заданием нашей команды из&nbsp;' +
                '<a href="http://park.mail.ru"> Технопарка@mail.ru</a>.'},
            ],
            parent: this._content
        });
    }

    public async render() {
        this._heading.innerHTML = "Об игре";
        this.variableMap.get('userpanel').setOptions(false, false, false);
        this.variableMap.get('userpanel').forceRender();
        this.text.render();
    }
}
