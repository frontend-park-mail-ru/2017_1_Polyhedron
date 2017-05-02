
export class Form {
    protected _fields: any;   // TODO make more concrete type
    protected _submitter: Element;

    constructor(fields, submitter) {
        this._fields = fields;
        this._submitter = submitter;
        this._setFieldsHook();

        this._submitter.addEventListener('click', (event) => {
            event.preventDefault();
            this.validateAndSubmit();
        });
    }

    protected _setFieldsHook() {
        Object.keys(this._fields).forEach(
            key => this._fields[key].setChangeCallBack(
                event => this.globalFormLogic(event)
            )
        );
    }

    public isValid() {
        return Object.keys(this._fields)
            .reduce((curr, key) => curr && this._fields[key].isValid(), true);
    }

    public validateAndSubmit() {
        if (this.isValid()) {
            this._sendData();
        } else {
            alert('Пожалуйста, введите корректные данные');
        }
    }

    protected _sendData() {
        // console.log('Tried to send data');
    }

    public globalFormLogic(event) {
        // console.log('Called global form logic');
    }
}
