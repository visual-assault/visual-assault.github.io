'use strict';
/*! visual-assault Gulp tasks
  *
  * @author Ron. A @0xADADA
  * @license MIT
  */

var config = {
    autoprefixer: {
        browsers: [
            'last 2 versions',
            '> 5%'
        ]
    },
    csslint: {
        csslintrc: '.csslintrc.json',
        src: [
            'static/stylesheets/**/*.css',
            '!static/vendor/*'
        ]
    },
    jshint: {
        src: ['static/javascript/**/*.js']
    },
    minifyCss: {
        options: {
            keepBreaks  : true,
            advanced    : false,
            rebase      : false,
            debug       : true
        }
    },
    revReplace : {
        manifest: 'static/stylesheets/rev-manifest.json',
        template: ['_includes/stylesheet_prod.html'],
        templateDir: '_includes/'
    },
    sass: {
        src: 'static/stylesheets/all.scss',
        dest: '_site/static/stylesheets',
        destBuild: 'static/stylesheets',
        options: {
            style: 'compressed',
            precision: 8
        }
    },
    browserSync: {
        proxy: 'localhost:4000',
        jekyllSrc: [
            '**/*.{html,yml,md,mkd,markdown}',
            '_config.yml',
            '!_includes/header.html',
            '!static/',
            '!node_modules/',
            '!_site/'
        ],
        jsSrc: ['static/javascript/**/*.js'],
        sassSrc: ['static/stylesheets/**/*.scss']
    }
};

var autoprefixer = require('gulp-autoprefixer'),
    csslint = require('gulp-csslint'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace');


// CSS Lint task
gulp.task('csslint', function() {
    return gulp.src(config.csslint.src)
        .pipe(csslint(config.csslint.csslintrc))
        .pipe(csslint.reporter('compact'))
        .pipe(csslint.reporter('fail'));
});


// JS hint task
gulp.task('jshint', function() {
    return gulp.src(config.jshint.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});


// Sass post-processing
gulp.task('sass', function () {
    return gulp.src(config.sass.src)
        .pipe(sourceMaps.init())
        .pipe(
            sass(config.sass.options)
            .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: config.autoprefixer.browsers
        }))
        .pipe(minifyCss(config.minifyCss.options))
        .pipe(browserSync.stream()) // send assets to browser-sync
        .pipe(sourceMaps.write('sourcemaps')) // write sourcemaps
        .pipe(gulp.dest(config.sass.dest)); // write output files
});


// Sass post-processing with cache busted file-names and updated refs
gulp.task('sass:build', function () {
    return gulp.src(config.sass.src)
        .pipe(
            sass(config.sass.options)
            .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: config.autoprefixer.browsers
        }))
        .pipe(minifyCss(config.minifyCss.options))
        .pipe(rev())
        .pipe(gulp.dest(config.sass.destBuild)) /* write output to src
                                                 * so that jekyll:build
                                                 * will copy the files
                                                 * into the _site
                                                 * production dir
                                                 */
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.sass.destBuild)); // write manifest
});


// BrowserSync / Livereload
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "_site"
        }
    });
    gulp.watch(config.browserSync.jekyllSrc, ['jekyll:dev'])
    gulp.watch(config.browserSync.jsSrc, ['jshint']);
    gulp.watch(config.browserSync.sassSrc, ['sass']);
});


// Jekyll development task
gulp.task('jekyll:dev', function() {
    return require('child_process')
        .spawn('jekyll', [
            'build',
            '--config',
            '_config.yml,_config_local.yml'
            ],
            { stdio: 'inherit' }
        );
});


// Jekyll build task
gulp.task('jekyll:master', ['sass:build'], function() {
    return require('child_process')
        .spawn('jekyll', ['build'],
            { stdio: 'inherit' }
        );
});


// Updated rev'ed references
gulp.task("revreplace", ['jekyll:master'], function() {
    var revManifest = gulp.src(config.revReplace.manifest);
    return gulp.src(config.revReplace.template)
        .pipe(revReplace({ manifest: revManifest}))
        .pipe(gulp.dest(config.revReplace.templateDir));
});


// Syntax checking
gulp.task('test', ['csslint', 'jshint']);


/* build task
 * Runs csslint, jshint, jasmine tests.
 * Translates SASS to CSS, concatenates & minifies.
 * Writes source maps and rev'es file names.
 * Updates base template to refer to the rev'ed assets.
 */
gulp.task('build', ['revreplace']);


// default task
gulp.task('default', ['test', 'sass', 'jekyll:dev', 'browser-sync']);
