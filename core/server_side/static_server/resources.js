'use strict';

const path = require("path");
const promiseReadFile = require("../../common/file_operations").promiseReadFile;


function getContentType(filePath) {
    const typeMap = {
        'html': 'text/html',
        'js': 'application/javascript',
        'json': 'application/json',
        'css': 'text/css'
    };

    const pathParts = filePath.split('.');
    const extension = pathParts[pathParts.length - 1];
    return typeMap[extension] || 'text/html';
}


class Resource {
    access(request) {}

    getContentType(request) {
        return getContentType(request.url);
    }
}


class Func extends Resource {
    constructor(func, contentType, ...options) {
        super();
        this.func = func;
        this.contentType = contentType || 'application/json';
        this.options = options;
    }

    access(request, response) {
        return this.func(request, response, ...this.options);
    }

    getContentType() {
        return this.contentType;
    }
}


class File extends Resource {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    access() {
        return promiseReadFile(this.filePath);
    }

    getContentType() {
        return getContentType(this.filePath);
    }
}


class Folder extends Resource {
    constructor(folderPath, urlPrefix) {
        super();
        this.folderPath = folderPath;
        this.urlPrefix = urlPrefix;
    }

    access(request) {
        const filePath = this.folderPath + request.url.replace(this.urlPrefix, '');
        const normalizedPath = path.relative(this.folderPath, filePath);

        if (normalizedPath.startsWith('..')) {
            throw new Error('Outer folder requested: ' + normalizedPath);
        }

        return promiseReadFile(filePath)
    }
}


class MultiFolder extends Resource {
    constructor(folderPaths, urlPrefix) {
        super();
        this.folderPaths = folderPaths;
        this.urlPrefix = urlPrefix;
    }

    access(request) {
        const normalizedPaths = this.folderPaths
            .map(dirPath => [dirPath + request.url.replace(this.urlPrefix, ''), dirPath])
            .map(([filePath, dirPath]) => path.relative(dirPath, filePath))
            .filter(normalizedPath => !normalizedPath.startsWith('..'));

        if (normalizedPaths.length === 0) {
            throw new Error('File by url ' + request.url + ' not found in dirs: ' + this.folderPaths);
        }

        return promiseReadFile(normalizedPaths[0]);
    }
}


module.exports.Func = Func;
module.exports.Resource = Resource;
module.exports.File = File;
module.exports.Folder = Folder;
module.exports.MultiFolder = MultiFolder;