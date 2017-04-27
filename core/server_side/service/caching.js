'use strict';

const fo = require('../../common/file_operations');


function getURLs(dirPath, _urlPrefix, _recursively, _dropFolderPrefix) {
    const recursively = _recursively || true;
    const dropFolderPrefix = _dropFolderPrefix || true;
    const urlPrefix = _urlPrefix || '/';

    let files = [];
    const dirs = [dirPath];

    while (dirs.length > 0) {
        const dir = dirs.pop();
        const [localFiles, localDirs] = fo.listDir(dir);

        localFiles.forEach(filePath => files.push(filePath));

        if (recursively) {
            localDirs.forEach(dirPath => dirs.push(dirPath));
        }
    }

    if (dropFolderPrefix) {
        files = files.map(filepath => {
            const pathParts = filepath.split('/');
            return pathParts[pathParts.length - 1];
        });
    }
    return files.map(str => urlPrefix + str);
}


function getUrlJson(dirPath, _urlPrefix, _recursively, _dropFolderPrefix) {
    return JSON.stringify(getURLs(dirPath, _urlPrefix, _recursively, _dropFolderPrefix));
}


function createCachedUrlsGetterAsync(dirPath, _urlPrefix, _recursively, _dropFolderPrefix) {
    return function() {
        return new Promise((resolve, reject) => {
            try {
                resolve(getUrlJson(dirPath, _urlPrefix, _recursively, _dropFolderPrefix));
            } catch (err) {
                reject(err);
            }
        });
    };
}


module.exports.getURLs = getURLs;
module.exports.getUrlJson = getUrlJson;
module.exports.createCachedUrlsGetterAsync = createCachedUrlsGetterAsync;
