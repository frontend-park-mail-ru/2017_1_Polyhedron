'use strict';

const path = require("path");
const promiseReadFile = require("../../common/file_operations").promiseReadFile;
const fs = require('fs');


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
    access() {}

    getHeaders() {
        return {};
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

    getHeaders() {
        return {
            'Content-Type': this.contentType
        };
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

    getHeaders() {
        return {
            'Last-Modified': fs.statSync(this.filePath).mtime.toString(),
            'Content-Type': getContentType(this.filePath)
        };
    }
}


class Folder extends Resource {
    constructor(folderPath, urlPrefix) {
        super();
        this.folderPath = folderPath;
        this.urlPrefix = urlPrefix;
    }

    access(request) {
        return promiseReadFile(this._getFilePath(request.url));
    }

    getHeaders(request) {
        const filePath = this._getFilePath(request.url);
        return {
            'Last-Modified': fs.statSync(filePath).mtime.toString(),
            'Content-Type': getContentType(request.url)
        };
    }

    _getFilePath(url) {
        const filePath = this.folderPath + url.replace(this.urlPrefix, '');
        const normalizedPath = path.relative(this.folderPath, filePath);

        if (normalizedPath.startsWith('..')) {
            throw new Error('Outer folder requested: ' + normalizedPath);
        }

        return filePath;
    }
}


module.exports.Func = Func;
module.exports.Resource = Resource;
module.exports.File = File;
module.exports.Folder = Folder;
