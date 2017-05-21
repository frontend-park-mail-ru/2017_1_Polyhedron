'use strict';

const fo = require('../../common/file_operations');
const fs = require('fs');
const path = require('path');


function getURLsFromDir(dirPath, _urlPrefix, _recursively, _dropFolderPrefix) {
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
        files = files
            .map(filepath => path.relative(dirPath, filepath))
            .filter(relPath => !relPath.startsWith('..'));
    }
    return files.map(str => urlPrefix + str);
}


function getFilesUrls(foldersInfo) {
    const [head, ...tail] = foldersInfo.map(folderInfo => getURLsFromDir(...folderInfo));
    return head.concat(...tail);
}


function getCachedUrlGen({foldersInfo, plainUrls}) {
    return function () {
        return new Promise((resolve, reject) => {
            try {
                const filesUrls = getFilesUrls(foldersInfo);
                resolve(JSON.stringify(filesUrls.concat(plainUrls)));
            } catch (err) {
                reject(err);
            }
        });
    };
}

function saveCachedUrls(outPath, {foldersInfo, plainUrls}) {
    const filesUrls = getFilesUrls(foldersInfo);
    const fileContent = JSON.stringify(filesUrls.concat(plainUrls));
    fs.writeFileSync(outPath, fileContent);
}

module.exports.getCachedUrlGen = getCachedUrlGen;
module.exports.saveCachedUrls = saveCachedUrls;
