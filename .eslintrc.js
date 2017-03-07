module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "mocha": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "no-var": "error",
        "camelcase": "error",
        "eol-last": "error",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};