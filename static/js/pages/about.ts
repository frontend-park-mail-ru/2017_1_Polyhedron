'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


export class About extends BasePage {
    private text: Text;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, options?) {
        super(heading, content, options);
        this.text = new Text({
            items: [
                {text: 'Наша игра - сетевой пинг-понг для трёх пользователей.'},
                {text: 'Мы используем JavaScript + Java.'},
                {text: 'Проект является семестровым заданием нашей команды из&nbsp;' +
                '<a href="http://park.mail.ru"> Технопарка@mail.ru</a>.'},
            ],
            parent: this._content
        });
    }

    public render() {
        this._heading.innerHTML = "Об игре";
        this.variableMap.get('userpanel').render();
        this.text.render();
    }
}
