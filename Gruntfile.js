'use strict';

const webpack = require('webpack');
const path = require("path");


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {

            build_index: {
                progress: true,
                entry: "./static/js/main.js",
                output: {
                    path: path.relative(__dirname, 'dist'),
                    filename: 'index_bundle.js'
                },

                module: {
                    loaders: [
                        {
                            loader: "babel-loader",

                            include: [
                                path.resolve(__dirname, 'static/js'),
                                path.resolve(__dirname, 'static/js/templates'),
                                path.resolve(__dirname, 'core'),
                                path.resolve(__dirname, 'core/_lib'),
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
                //],
            }
        },

        watch: {
            js: {
                files: [
                    './core/*/*.js',
                    './static/js/*.js',
                    './static/js/*/*.js'
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
            src: ['core/*.js', 'static/js/*.js', 'static/js/pages/*.js', './tests/*.js', '.pug_compiler.js']
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
            compile_pug: 'node pug_compiler.js',
        },

    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('postinstall', [
        'exec:compile_pug', 'webpack'
    ]);

    grunt.registerTask('test', [
        'eslint', 'mochaTest:test'
    ]);

    grunt.registerTask('dev', ['exec:compile_pug', 'webpack', 'concurrent:watch']);
};


