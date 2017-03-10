
const pug = require('pug');
const wrap = require('pug-runtime/wrap');
const fs = require('fs');
const path = require('path');


function readFile(filePath) {
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


function readDir(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}


function compileImportable(templateFile, resultFile) {
    return readFile(templateFile)
        .then(pugSrc => {
            let compiledCode = pug.compileClient(pugSrc, {
                externalRuntime: true
            });
            fs.writeFile(resultFile, wrap(compiledCode) + "\nmodule.exports = template;", err => {
                if (err) {
                    console.error(err);
                }
            });
        })
        .catch(err => console.error(err));
}


function compileAll(templateDir, resultDir) {
    readDir(templateDir)
        .then(fileNames => {
            fileNames.forEach(fileName => {
                if (fileName.match(/.*\.pug/i)) {
                    let templatePath = path.join(templateDir, fileName);
                    let resultFileName = fileName.split('.')[0] + '.js';
                    let resultPath = path.join(resultDir, resultFileName);
                    compileImportable(templatePath, resultPath);
                }
            });
        })
        .catch(err => console.error(err));
}


module.exports = compileAll;
