"use strict";

const fs = require("fs");


const http = require("http");


const path = require("path");


const REG_EXP_PREFIX = "REGEX";


const PREFIX_STR_PREFIX = "PREFIX";


/**
 *
 * @param pagePath path of the static file to return
 * @returns {Function} callback responding with predefined path
 * @constructor
 */
function BindedFile (pagePath) {
    return function (request, response) {
        console.log("Requested URL: ", request.url);

        fs.readFile(pagePath, function (err, data) {
            if (err) {
                console.error(err);
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("404 Not Found\n");
            } else {
                response.write(data);
            }
            response.end();
        });
    }
}


/**
 *
 * @param folderPath path to the static root
 * @param urlPrefix (optional): prefix which must be removed to get relative path
 * @returns {Function}
 * @constructor
 */
function FolderFile (folderPath, urlPrefix) {
    return function (request, response) {
        console.log("Requested URL: ", request.url);

        let relPath = request.url;
        if (urlPrefix) {
            relPath = relPath.replace(urlPrefix, "");
        }

        let filePath = folderPath + relPath;
        let normalizedPath = path.relative(folderPath, filePath);
        if (normalizedPath.startsWith('..')) {
            console.log(normalizedPath);
            response.writeHead(404, {"Content-Type": "text/html"});
            response.end();
            return;
        }

        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.error(err);
                response.write(err.toString());
            } else {
                response.write(data);
            }
            response.end();
        });
    }
}


function getRegexStr (str) {
    return REG_EXP_PREFIX + str;
}


function getPrefixStr (str) {
    return PREFIX_STR_PREFIX + str;
}


function _isRegExpStr (str) {
    return str.startsWith(REG_EXP_PREFIX);
}


function _isPrefixStr (str) {
    return str.startsWith(PREFIX_STR_PREFIX);
}


function _regexFromRegexStr (str) {
    return str.replace(REG_EXP_PREFIX, "");
}


function _prefixFromPrefixStr (prefixStr) {
    return prefixStr.replace(PREFIX_STR_PREFIX, "");
}


const _callbackTemplates = {
    "default": function (request, response) {
        console.log("Incorrect URL requested: ", request.url);

        fs.readFile("./static/html/error_page.html", function (err, data) {
            if (err) {
                console.error(err);
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("404 Not Found\n");
            } else {
                response.write(data.toString());
            }
            response.end();
        });
    },

    "pageNotFound": function (request, response) {
        console.error("404 error: ", request.url);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not Found\n");
        response.end();
    },

    "notAuthorized": function (request, response) {
        console.log("403 error: ", request.url);
        response.writeHead(403, {"Content-Type": "text/html"});
        response.write("403 Not Found\n");
        response.end();
    }
};


class Router {
    constructor() {
        this._urlDict = {};
    }

    addPlainURL(url, bind) {
        this._urlDict[url] = bind;
    }

    addRegexURL(url, bind) {
        this._urlDict[getRegexStr(url)] = bind;
    }

    addPrefixURL(url, bind) {
        this._urlDict[getPrefixStr(url)] = bind;
    }

    get getURLDict() {
        return this._urlDict;
    }
}


function getStaticServer (router) {
    let urlCallbackDict = router.getURLDict;

    return http.createServer(function (request, response) {
        let callback = urlCallbackDict[request.url] || null;

        if (callback) {
            callback(request, response);
            console.log("Complete match succeeded: ", request.url);
            return
        } else {
            console.log("Complete match failed: ", request.url);
        }

        for (let url in urlCallbackDict) {
            if (_isRegExpStr(url) && request.url.match(new RegExp(_regexFromRegexStr(url)))) {
                callback = urlCallbackDict[url];
                console.log("URL ", request.url, " match regex: ", url);
                break;
            }
        }

        if (callback) {
            callback(request, response);
            return
        } else {
            console.log("Regex match failed: ", request.url);
        }

        let urlPair = {
            "longestPrefix": "",
            "url": null
        };

        for (let url in urlCallbackDict) {
            let prefix = _prefixFromPrefixStr(url);
            if (_isPrefixStr(url) && request.url.startsWith(prefix)) {
                if (prefix.length > urlPair.longestPrefix.length) {
                    urlPair.longestPrefix = prefix;
                    urlPair.url = url;
                }
            }
        }

        if (urlPair.url) {
            callback = urlCallbackDict[urlPair.url];
            callback(request, response);
            console.log("URL ", request.url, " match prefix ", urlPair.url);
            return
        } else {
            console.log("Prefix match failed: ", request.url, " ", urlPair.longestPrefix);
        }

        callback = _callbackTemplates.pageNotFound;
        callback(request, response);
    });
}

module.exports.BindedFile = BindedFile;
module.exports.FolderFile = FolderFile;
module.exports.getRegexStr = getRegexStr;
module.exports.getPrefixStr = getPrefixStr;
module.exports.Router = Router;
module.exports.getStaticServer = getStaticServer;
