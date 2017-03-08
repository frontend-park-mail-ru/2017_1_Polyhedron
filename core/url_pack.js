
const DEFAULT_METHOD = 'GET';

class URLPack {
    constructor(root, relativeURLs) {
        this.root = root;
        this.relativeURLs = this._getURLObject(relativeURLs);
    }

    _getURLObject(relativeURLs) {
        let result = {};
        relativeURLs.forEach(urlInfo => {
            result[urlInfo.name] = urlInfo;
        });

        return result;
    }

    getAbsURL(urlAlias) {
        return this.root + this.relativeURLs[urlAlias].url;
    }

    getMethod(urlAlias) {
        return this.relativeURLs[urlAlias].method || DEFAULT_METHOD;
    }
}

module.exports = URLPack;