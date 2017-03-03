'use strict';

const webpack = require('webpack');
const path = require("path");


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {
            build: {
                progress: true,
                entry: "./core/game_start.js",
                output: {
                    path: './dist',
                    filename: 'bundle.js'
                },

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

                plugins: [
                    new webpack.optimize.UglifyJsPlugin({minimize: true})
                ]
            },
        },

        watch: {
            js: {
                files: [
                    './core/*/*.js'
                ],
                tasks: ['webpack']
            }
        },

        jshint: {
            all: ['core/*.js'],
            options: {
                "esversion": 6,

                "node": true,
                "mocha": true,
                "qunit": true,

                "browser": true,

                "indent": 4,
                "varstmt": true,
                "unused": true,
                "camelcase": true
            }
        },

        mochaTest: {
            test: {
                src: ['tests/test.js']
            }
        }


    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('jshintStarted', () => {console.log('*** Static analysis ***');});
    grunt.registerTask('mochaStarted', () => {console.log('*** Testing ***');});
    grunt.registerTask('webpackStarted', () => {console.log('*** Minification ***');});

    grunt.registerTask('postinstall', [
        'webpackStarted', 'webpack'
    ]);

    grunt.registerTask('test', [
        'jshintStarted', 'jshint',
        'mochaStarted', 'mochaTest'
    ]);

    grunt.registerTask('default', [
        'jshintStarted', 'jshint',
        'mochaStarted', 'mochaTest',
        'webpackStarted', 'webpack'
    ]);
};

