'use strict';

const webpack = require('webpack');
const path = require("path");


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {

            pre_build_index: {
                progress: true,
                entry: "./static/js/main.js",
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'index_bundle.js'
                },

                resolve : {
                    extensions: [".ts", ".js"]
                },

                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            loader: 'ts-loader',

                            include: [
                                path.resolve(__dirname, 'static/js'),
                                path.resolve(__dirname, 'static/js/templates'),
                                path.resolve(__dirname, 'core'),
                                path.resolve(__dirname, 'core/_lib'),
                            ],
                        },

                    ]
                }
            },

            /*
            build_index: {
                progress: true,
                entry: "./dist/temp_index_bundle.js",
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    filename: 'index_bundle.js'
                },

                resolve : {
                    extensions: [".ts", ".js"]
                },

                module: {
                    rules: [
                        {
                            loader: "babel-loader",

                            include: [
                                path.resolve(__dirname, 'dist')
                            ],

                            test: /\.js$/,


                            query: {
                                plugins: ['transform-runtime'],
                                presets: ['es2015'],

                            }

                        },

                    ]
                }

                //plugins: [
                //    new webpack.optimize.UglifyJsPlugin({minimize: true})
                //],
            }
            */
        },

        watch: {
            js: {
                files: [
                    './core/common/*.js',
                    './core/server_side/**/*.js',
                ],
                tasks: ['webpack']
            },

            ts: {
                files: [
                    './core/**/*.ts',
                    './static/**/*.ts'
                ],
                tasks: ['webpack']
            },

            pug: {
                files: [
                    './templates/*.pug'
                ],
                tasks: ['exec:compile_pug', 'webpack']
            }
        },

        eslint: {

            options: {
                configFile: '.eslintrc.js'
            },
            src: [
                'core/server_side/**/*.js',
                './tests/*.js',
                '.pug_compiler.js',
                '!core/server_side/ws_server/server.js'
            ]
        },

        tslint: {
            options: {
                configuration: "tslint.json",
                force: false,
                fix: false
            },
            files: {
                src: [
                    "./core/**/*.ts",
                    "./static/**/*.ts"
                ]
            }
        },

        mochaTest: {
            test: {
                src: ['tests/test.js']
            },

            backend_test: {
                src: ['tests/backend_test.js']
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
            compile_pug: 'node compilers/pug_compiler.js',
            compile_swagger: 'node compilers/swagger_compiler.js'
        },

    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('postinstall', [
        'exec:compile_pug', 'exec:compile_swagger', 'webpack'
    ]);

    grunt.registerTask('test', [
        'eslint', 'tslint', /*'mochaTest:test'*/
    ]);

    grunt.registerTask('dev', ['exec:compile_pug', 'webpack', 'concurrent:watch']);
};


