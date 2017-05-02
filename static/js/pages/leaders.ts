'use strict';

import {BasePage} from './base';
import {Text} from '../components/text/text';
import {LeaderBoard} from '../components/leaderboard/leaderboard';
import {BackendAPI} from '../../../core/client_side/site_service/backend_api';
import {Autowired} from "../../../core/client_side/game_mechanics/experimental/decorators";
import {VariableContext} from "../../../core/client_side/game_mechanics/experimental/context";


const DEFAULT_LEADER_COUNT = 10;

export class Leaders extends BasePage {
    private text: Text;
    private _leaderCount: number;
    private leaders: LeaderBoard;

    @Autowired(BackendAPI)
    private backendAPI: BackendAPI;

    @Autowired(VariableContext)
    private variableMap: VariableContext;

    constructor(heading, content, options?, leaderCount?) {
        super(heading, content, options);
        this.text = new Text({
            items: [
                {text: 'Список лидеров загружается...'},
            ],
            parent: this._content
        });
        this._leaderCount = leaderCount || DEFAULT_LEADER_COUNT;
    }

    public render() {
        this._heading.innerHTML = "Топ-10";
        this.text.render();

        this.variableMap.get('userpanel').render();

        this.backendAPI.getLeaders(this._leaderCount)
            .then(response => {
                return response.json();
            })
            .then(responseJSON => {
                this.leaders = new LeaderBoard({
                    items: responseJSON.data,
                    parent: this._content
                }).render();
            });
    }
}