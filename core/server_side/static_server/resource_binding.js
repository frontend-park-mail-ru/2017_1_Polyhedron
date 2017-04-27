'use strict';

const resources = require('./resources');


function BindedResource(resource) {
    return (request, response) => {
        console.log("Requested URL: ", request.url);

        resource.access(request, response)
            .then(data => {
                response.writeHead(200, {"Content-Type": resource.getContentType(request)});
                response.write(data);
            })
            .catch(err => {
                console.error(err);
                response.writeHead(404, {"Content-Type": "text/html"});
                response.write("404 Not Found\n");
            })
            .then(
                () => response.end()
            );
    }
}


function BindedFunction (func, contentType, ...options) {
    return BindedResource(new resources.Func(func, contentType, ...options));
}


/**
 *
 * @param pagePath path of the static file to return
 * @returns {Function} callback responding with predefined path
 * @constructor
 */
function BindedFile (pagePath) {
    return BindedResource(new resources.File(pagePath));
}


/**
 *
 * @param folderPath path to the static root
 * @param urlPrefix: prefix which must be removed to get relative path
 * @returns {Function}
 * @constructor
 */
function BindedFolder (folderPath, urlPrefix) {
    return BindedResource(new resources.Folder(folderPath, urlPrefix));
}


/**
 *
 * @param folderPaths paths to search folders
 * @param urlPrefix: prefix which must be removed to get relative path
 * @returns {Function}
 * @constructor
 */
function BindedMultiFolder (folderPaths, urlPrefix) {
    return BindedResource(new resources.MultiFolder(folderPaths, urlPrefix));
}


module.exports.BindedFunction = BindedFunction;
module.exports.BindedResource = BindedResource;
module.exports.BindedFile = BindedFile;
module.exports.BindedFolder = BindedFolder;
module.exports.BindedMultiFolder = BindedMultiFolder;
