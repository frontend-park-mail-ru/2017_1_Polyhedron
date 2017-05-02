

const fs = require('fs');
const YAML = require('yaml-js');
const path = require("path");


const SOURCE = path.resolve(__dirname, '..', 'swagger.yml');
const DEST = path.resolve(__dirname, '..', 'swagger.json');


fs.writeFile(
    DEST,
    JSON.stringify(YAML.load(fs.readFileSync(SOURCE).toString())),
    err => console.log(err)
);
