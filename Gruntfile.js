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
                    './static/js/templates/*.pug'
                ],
                tasks: ['exec:compile_pug']
            }
        },

        eslint: {

            options: {
                configFile: '.eslintrc.js'
            },
            src: ['core/*.js', 'static/js/*.js']
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

    grunt.registerTask('dev', ['webpackStarted', 'webpack:build', 'concurrent:watch']);
};

