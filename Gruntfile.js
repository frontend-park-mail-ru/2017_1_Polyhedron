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
                }
            },

            build_heroku: {
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

            build_spa_js: {
                progress: true,
                entry: "./static/js/main.js",
                output: {
                    path: './dist',
                    filename: 'spa_bundle.js'
                },

                module: {
                    loaders: [
                        {
                            loader: "babel-loader",

                            include: [
                                path.resolve(__dirname, 'static/js'),
                                path.resolve(__dirname, 'static/js/templates'),
                            ],

                            test: /\.js$/,

                            query: {
                                plugins: ['transform-runtime'],
                                presets: ['es2015'],
                            }
                        },
                    ]
                },

                //plugins: [
                //    new webpack.optimize.UglifyJsPlugin({minimize: true})
                //]
            },
        },

        watch: {
            js: {
                files: [
                    './core/*.js'
                ],
                tasks: ['webpack']
            },

            pug: {
                files: [
                    './templates/*.pug'
                ],
                tasks: ['exec:compile_pug']
            },

            static_js: {
                files: [
                    './static/js/*.js',
                    './static/js/templates/*.js'
                ],
                tasks: ['webpack:build_spa_js']
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
        },

        exec: {
            compile_pug: 'node .pug_compiler.js',
        },

    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('eslintStarted', () => {console.log('*** Static analysis ***');});
    grunt.registerTask('mochaStarted', () => {console.log('*** Testing ***');});
    grunt.registerTask('webpackStarted', () => {console.log('*** Minification ***');});

    grunt.registerTask('postinstall', [
        'webpackStarted', 'exec:compile_pug', 'webpack:build_heroku'
    ]);

    grunt.registerTask('test', [
        'eslintStarted', 'eslint',
        'mochaStarted', 'mochaTest'
    ]);

    grunt.registerTask('dev', ['webpackStarted', 'webpack:build', 'webpack:build_spa_js',
        'exec:compile_pug', 'concurrent:watch']);
};


