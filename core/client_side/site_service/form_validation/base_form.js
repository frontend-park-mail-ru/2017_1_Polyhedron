
export class Form {
    constructor(fields, submitter) {
        this._fields = fields;
        this._submitter = submitter;
        this._setFieldsHook();

        this._submitter.addEventListener('click', (event) => {
            event.preventDefault();
            this.validateAndSubmit();
        });
    }

    _setFieldsHook() {
        for (let fieldName in this._fields) {
            this._fields[fieldName].setChangeCallBack(event => this.globalFormLogic(event));
        }
    }

    isValid() {
        let isValid = true;
        for (let fieldName in this._fields) {
            isValid = isValid && this._fields[fieldName].isValid();
        }

        return isValid;
    }

    validateAndSubmit() {
        if (this.isValid()) {
            this._sendData();
        } else {
            alert('Input valid data, please');
        }
    }

    _sendData(){
        console.log('Tried to send data');
    }

    globalFormLogic() {
        console.log('Called global form logic');
    }
}
