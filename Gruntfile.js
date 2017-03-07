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
                    './core/*.js'
                ],
                tasks: ['webpack']
            }
        },

        eslint: {

            options: {
                configFile: '.eslintrc.js'
            },
            src: ['core/*.js']
        },

        mochaTest: {
            test: {
                src: ['tests/test.js']
            }
        },

        concurrent: {
            watch: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask('eslintStarted', () => {console.log('*** Static analysis ***');});
    grunt.registerTask('mochaStarted', () => {console.log('*** Testing ***');});
    grunt.registerTask('webpackStarted', () => {console.log('*** Minification ***');});

    grunt.registerTask('postinstall', [
        'webpackStarted', 'webpack'
    ]);

    grunt.registerTask('test', [
        'eslintStarted', 'eslint',
        'mochaStarted', 'mochaTest'
    ]);

    grunt.registerTask('default', [
        'eslintStarted', 'eslint',
        'mochaStarted', 'mochaTest',
        'webpackStarted', 'webpack', 'concurrent:watch'
    ]);

    grunt.registerTask('dev', ['webpackStarted', 'webpack', 'concurrent:watch']);
};

