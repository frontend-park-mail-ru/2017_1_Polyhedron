/**
 * Created by artem on 2/12/17.
 */

"use strict";

exports.fs = require("fs");
exports.http = require("http");

exports.FileByPrefixFunc = function (request, response) {
    console.log("Requested URL: " + request.url);
    exports.fs.readFile(request.url, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            response.write(data);
        }
        response.end();
    });
};

/**
 *
 * @param pagePath path of the static file to return
 * @returns {Function} callback responding with predefined path
 * @constructor
 */
exports.BindedFileFunc = function(pagePath) {
    return function (request, response) {
        console.log("Requested URL: " + request.url);
        exports.fs.readFile(pagePath, function (err, data) {
            if (err) {
                console.error(err);
                response.write(err);
                response.end();
            } else {
                response.write(data);
            }
            response.end();
        });
    }
};

/**
 *
 * @param folderPath path to the static root
 * @param urlPrefix (optional): prefix which must be removed to get relative path
 * @returns {Function}
 * @constructor
 */
exports.FolderFileFunc = function (folderPath, urlPrefix) {
    return function (request, response) {
        console.log("Requested URL: " + request.url);

        let relPath = request.url;
        if (urlPrefix) {
            relPath = relPath.replace(urlPrefix, "");
        }

        let filePath = folderPath + relPath;
        exports.fs.readFile(filePath, function (err, data) {
            if (err) {
                console.error(err);
                response.write(err.toString());
                response.end();
            } else {
                response.write(data);
            }
            response.end();
        });
    }
};

exports.regExpPrefix = "REGEX";
exports.prefixStrPrefix = "PREFIX";

exports.getRegexStr = function (str) {
    return exports.regExpPrefix + str;
};

exports.getPrefixStr = function (str) {
    return exports.prefixStrPrefix + str;
};

function isRegExpStr (str) {
    return str.startsWith(exports.regExpPrefix);
}

function isPrefixStr (str) {
    return str.startsWith(exports.prefixStrPrefix);
}

function regexFromRegexStr (str) {
    return str.replace(exports.regExpPrefix, "");
}

function prefixFromPrefixStr (prefixStr) {
    return prefixStr.replace(exports.prefixStrPrefix, "");
}

exports.callbackTemplates = {
    "default": function (request, response) {
        console.log("Incorrect URL requested: " + request.url);

        exports.fs.readFile("./static/html/error_page.html", function (err, data) {
            if (err) {
                console.error(err);
            } else {
                response.write(data.toString());
            }
            response.end();
        });
    },

    "pageNotFound": function (request, response) {
        console.error("404 error: " + request.url);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not Found\n");
        response.end();
    },

    "notAuthorized": function (request, response) {
        console.log("403 error: " + request.url);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("403 Not Found\n");
        response.end();
    }
};

exports.getStaticServer = function(_urlCallbackDict) {
    let urlCallbackDict = _urlCallbackDict || {};

    return exports.http.createServer(function (request, response) {
        let callback = urlCallbackDict[request.url] || null;

        if (!callback) {
            console.log("Complete match failed: " + request.url);
            for (let url in urlCallbackDict) {
                if (isRegExpStr(url) && request.url.match(new RegExp(regexFromRegexStr(url)))) {
                    callback = urlCallbackDict[url];
                    console.log("URL " + request.url +  " match regex: " + url);
                    break;
                }
            }

            if (!callback) {
                console.log("Regex match failed: " + request.url);
            } else {
                callback(request, response);
                return
            }

            for (let url in urlCallbackDict) {
                if (isPrefixStr(url) && request.url.startsWith(prefixFromPrefixStr(url))) {
                    callback = urlCallbackDict[url];
                    console.log("URL " + request.url + " match prefix " + url);
                }
            }

            if (!callback) {
                console.log("Prefix match failed: " + request.url);
            } else {
                callback(request, response);
                return
            }
        }

        callback = callback || exports.callbackTemplates.pageNotFound;
        callback(request, response);
    });
};
