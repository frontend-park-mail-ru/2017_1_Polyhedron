
const DEFAULT_METHOD = 'GET';

export class URLPack {
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
        let relativeURL = this.relativeURLs[urlAlias].url;
        if (!relativeURL) {
            for (let urlCandidate in this.relativeURLs) {
                if (urlCandidate.match(relativeURL)) {
                    relativeURL = urlCandidate;
                }
            }
        }

        if (relativeURL) {
            return this.root + relativeURL;
        }

        throw new URIError('URL not found');
    }

    getMethod(urlAlias) {
        return this.relativeURLs[urlAlias].method || DEFAULT_METHOD;
    }
}
