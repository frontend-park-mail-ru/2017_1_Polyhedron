'use strict';

import * as renderForm from '../../templates/render_form';

export class Form {
    constructor(options = {inputs: {}, controls: []}) {
        this.name = options.name;
        this.inputs = options.inputs;
        this.controls = options.controls;
        this.parent = options.parent;
        this.template = renderForm.template;
    }

    render() {
        this.parent.innerHTML = this.template({name: this.name, inputs: this.inputs, controls: this.controls});
    }

    /**
     * Подписка на событие
     * @param {string} type - имя события
     * @param {function} callback - коллбек
     */
    on(type, callback) {
        this.el.addEventListener(type, callback);
    }

    /**
     * Взять данные формы
     * @return {object}
     */
    getFormData() {
        let form = this.el.querySelector('form');
        let elements = form.elements;
        let fields = {};

        Object.keys(elements).forEach(element => {
            let name = elements[element].name;
            let value = elements[element].value;

            if (!name) {
                return;
            }

            fields[name] = value;
        });

        return fields;
    }

}
