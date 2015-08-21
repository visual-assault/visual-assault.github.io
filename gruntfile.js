/*! visual assault Grunt tasks
 *
 * @author Ron. A @0xADADA
 * @license MIT
 */

module.exports = function(grunt) {

    grunt.initConfig( {
        pkg : grunt.file.readJSON( 'package.json' ),

        watch: {
            options: {
                livereload: true
            },
            jekyll: {
                files: [
                    '**/*.{html,yml,md,mkd,markdown}',
                    '_config.yml',
                    '!static/vendor/**/*',
                    '!node_modules/**/*',
                    '!_site/node_modules/**/*'
                ],
                tasks: [
                    'jekyll:dev'
                ]
            },
            sass: {
                files: [
                    'static/stylesheets/**/*.scss'
                ],
                tasks: [
                    'clean',
                    'sass',
                    'postcss',
                    'cssmin',
                    'cacheBust',
                    'jekyll:dev'
                ]
            }
        },

        sass: {
            all: {
                options: {
                    style: 'compressed',
                    precision: 8
                },
                files: {
                    'static/stylesheets/all.css': 'static/stylesheets/all.scss'
                }
            }
        },

        clean : {
            css : {
                src : [
                    "static/stylesheets/*.css",
                    "static/stylesheets/*.map"
                ]
            }
        },

        /* Apply vendor prefixes to non-standard css properties.
         */
         postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'static/stylesheets' // ...to the specified directory
                },
                processors: [
                    // add vendor prefixes
                    require('autoprefixer-core')({
                        browsers: [
                            'last 2 versions',
                            '> 5%'
                        ]
                    })
                ]
            },
            dist: {
                src: 'static/stylesheets/all.css'
            }
        },

        /* Syntax checking for CSS
         * https://github.com/gruntjs/grunt-contrib-csslint
         */
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: [ 'static/stylesheets/**/*.css' ]
            }
        },

        /* Build Jekyll site.
         */
        jekyll: {
            options: {
                bundleExec: false
            },
            master: {
                options: {
                    config: '_config.yml'
                }
            },
            dev: {
                options: {
                    config: '_config.yml,_config_local.yml'
                }
            },
            server: {
                options: {
                    config: '_config.yml,_config_local.yml',
                    serve: true
                }
            },
            check: {
                options: {
                    doctor: true
                }
            }
        },

        /* Concatenate & Minify all CSS
         */
        cssmin: {
            options: {
                keepSpecialComments: 1,
                processImport: true,
                rebase: true,
                relativeTo: '/static/stylesheets',
                root: 'static',
                roundingPrecision: -1 /* Disable rounding precision */
            },
            css: {
                src: [
                    'static/stylesheets/all.css'
                ],
                dest: 'static/stylesheets/all.min.css'
            }
        },

        /* Inline small image assets directly into CSS with data-URIs */
        dataUri : {
            css : {
                src: [ 'static/stylesheets/*.css' ],
                dest: 'static/stylesheets',
                options: {
                    // specified files are only encoding
                    target: [ 'static/images/*' ],
                    // adjust relative path?
                    fixDirLevel: true,
                    baseDir: 'static',
                    // Do not inline any images larger than this size.
                    // - 2048 is a size recommended by Google's mod_pagespeed
                    //   based on long URLs
                    // - 24000 is the sweet-spot where the ASCII representation
                    //   size will be larger than the binary data representation.
                    // - The absolute MAX should be 32768- ever.
                    maxBytes: 24000
                }
            }
        },

        /* Cache busting static asset revisioning through file content
         * hashing.
         */
        cacheBust: {
            options: {
                algorithm: 'sha256',
                baseDir: './',
                deleteOriginals: true,
                enableUrlFragmentHint: true,
                ignorePatterns: [
                    '/stylesheets/all.css', /* Dont cache-bust the
                                             * development reference
                                             */
                    'static/images/meta/*',
                    /* Vendor assets don't change (much) */
                    '/vendor/bower_components/*'
                ],
                /* No need (yet) to output a JSON manifest of cache-busted
                   filenames
                jsonOutput: true, */
                length: 8
            },
            templates: {
                src: '_includes/header.html'
            }
        }

    } );

    // Load our 3rd party plugins
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-jekyll' );
    grunt.loadNpmTasks( 'grunt-postcss' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-data-uri' );
    grunt.loadNpmTasks( 'grunt-cache-bust' );

    /* default task alias
     * Developer-only tooling.
     * only need to run when developer wants to see production-ready CSS
     * on their developer VM.
     */
    grunt.registerTask( 'default', [
        'csslint',
        'clean',
        'sass',
        'postcss',
        'cssmin',
        /*'dataUri',*/
        'cacheBust',
        'jekyll:dev',
        'watch'
    ] );

    /* `syntax` task alias
     * Runs any Javascript and CSS code-quality tests
     */
    grunt.registerTask( 'syntax', [
        'csslint',
        'jekyll:check'
    ] );

    /* Run the dev server.
     */
    grunt.registerTask( 'serve', [
        'jekyll:server'
    ]);

    /* Production build process.
     */
    grunt.registerTask( 'build', [
        'clean',
        'sass',
        'postcss',
        'cssmin',
        /*'dataUri',*/
        'cacheBust',
        'jekyll:master'
    ] );

};
