class BasePage {
    constructor (subheader, content, options) {
        this.subheader = subheader;
        this.content = content;
        this.options = options;
    };

    render() {
        //override this method
    };
}

module.exports = BasePage;
