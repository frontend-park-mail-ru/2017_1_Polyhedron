'use strict';

const path = require("path");


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webpack: {
            preBuildIndex: {
                progress: true,
                entry: "./static/js/main.ts",
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

        },

        postcss: {
            options: {
                processors: [
                    require('precss')(),
                    require('autoprefixer')(),
                    require('postcss-focus')(),
                    require('postcss-sorting')({
                        'order': ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
                        'properties-order': "alphabetical",
                        'clean-empty-lines': true,
                    }),
                    require('cssnano')()
                ]
            },
            dist: {
                src: './static/css/main.css',
                dest: './dist/css_bundle.css'
            }

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
                tasks: ['exec:compilePug', 'webpack']
            },

            css: {
                files: [
                    './static/css/*.css'
                ],
                tasks: ['postcss']
            }
        },

        eslint: {

            options: {
                configFile: '.eslintrc.js'
            },
            src: [
                'core/server_side/**/*.js',
                '!core/server_side/ws_server/*.js',
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

        stylelint: {
            all: ['static/css/*.css']
        },

        mochaTest: {
            test: {
                src: ['tests/test.js']
            },

            backendTest: {
                src: ['tests/backendTest.js']
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
            compilePug: 'node compilers/pug_compiler.js',
            compileSwagger: 'node compilers/swagger_compiler.js',
            minifyBundle: 'node compilers/minificator.js',
            saveCachedUrls: 'node compilers/cache_url_generator.js'
        },

    });

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-postcss');


    grunt.registerTask('postinstall', [
        'exec:compilePug', 'exec:compileSwagger', 'webpack', /*'exec:minifyBundle',*/ 'postcss', 'exec:saveCachedUrls'
    ]);

    grunt.registerTask('test', [
        'eslint', 'tslint', 'stylelint'
    ]);

    grunt.registerTask('dev', ['exec:compilePug', 'webpack:preBuildIndex', 'postcss',
        'exec:saveCachedUrls', 'concurrent:watch']);
};
