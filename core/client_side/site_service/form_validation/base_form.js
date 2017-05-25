"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PAGE_SELECTORS = {
    alert: '.js-alert',
};
class Form {
    constructor(fields, submitter) {
        this._fields = fields;
        this._submitter = submitter;
        this._alert = document.querySelector(PAGE_SELECTORS.alert);
        this._setFieldsHook();
        this._submitter.addEventListener('click', (event) => {
            event.preventDefault();
            this.validateAndSubmit();
        });
    }
    _setFieldsHook() {
        Object.keys(this._fields).forEach(key => this._fields[key].setChangeCallBack(event => this.globalFormLogic(event)));
    }
    isValid() {
        return Object.keys(this._fields)
            .reduce((curr, key) => curr && this._fields[key].isValid(), true);
    }
    validateAndSubmit() {
        if (this.isValid()) {
            this._sendData();
        }
        else {
            this._alert.innerHTML = 'Пожалуйста, введите корректные данные';
        }
    }
    _sendData() {
        // console.log('Tried to send data');
    }
    globalFormLogic(event) {
        // console.log('Called global form logic');
    }
}
exports.Form = Form;
//# sourceMappingURL=base_form.js.map