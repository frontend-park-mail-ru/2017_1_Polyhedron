
const fs = require('fs');
const path = require('path');


function promiseReadFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


function promiseReadDir(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(dirPath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


function listDir(folder) {
    const files = [];
    const dirs = [];

    fs.readdirSync(folder)
        .map(filename => path.join(folder, filename))
        .forEach(filePath => {
            if (fs.lstatSync(filePath).isFile()) {
                files.push(filePath);
            } else {
                dirs.push(filePath);
            }
        });

    return [files, dirs];
}


module.exports.promiseReadFile = promiseReadFile;
module.exports.promiseReadDir = promiseReadDir;
module.exports.listDir = listDir;
