

const path = require("path");

module.exports = {
    module: {
        loaders: [
            {
                loader: "babel-loader",

                include: [
                    path.resolve(__dirname, "core"),
                ],

                test: /\.js$/,

                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015'],
                }
            },
        ]
    },

    entry: "./core/game_start.js",
    output: {
        path: './dist',
        filename: 'bundle.js'
    }
};
