//http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html
var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
//var tscConfig = require('./tsconfig.json');
var tscConfig = require('./tsconfigSysemJS.json');
var tslint = require('gulp-tslint');
var gulpTypings = require("gulp-typings");
var sourcemaps = require('gulp-sourcemaps');
var cacheBuster = require('gulp-cache-bust');
var SystemJSCacheBuster = require("systemjs-cachebuster");
var cacheSysBuster = new SystemJSCacheBuster();
var uglify = require('gulp-uglify');
var lazypipe = require('lazypipe');
var gulpif = require('gulp-if')
var cssnano = require('gulp-cssnano');
var uglifycss = require('gulp-uglifycss');

var webpack = require('gulp-webpack');
//var webpackConfig = require('./config/webpack.test.js');
var webpackProdConfig = require('./webpack.config.js');

// TypeScript
gulp.task('webpack:ts', function () {
    // TypeScript
    var tsResult = gulp.src(['./src/*.ts'])
        .pipe(webpack(webpackProdConfig))
        .pipe(gulp.dest('./'));
});


gulp.task('watch', function () {
    gulp.watch('App/**/*.*', ['build:build-lite', 'rev:cacheBuster']);
});



gulp.task("min:css", function () {
    gulp.src('dist/App/**/*.css')
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest('dist/App/**/*.css'));
});

gulp.task("min:js", function () {
    return gulp.src('dist/App/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest("dist/App/**/."))

});

gulp.task("installTypings", function () {
    var stream = gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. 
    return stream; // by returning stream gulp can listen to events from the stream and knows when it is finished. 
});

gulp.task('rev:cacheBuster', ['rev:cacheSysBuster'], function () {
    return gulp.src('./index.html')
        .pipe(cacheBuster())
        .pipe(gulp.dest('.'));
});

gulp.task('rev:cacheSysBuster', function () {
    return gulp
        .src('dist/App/**/*.js')
        .pipe(cacheSysBuster.full())
        .pipe(cacheSysBuster.incremental());
});

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/App/**/*');
});

gulp.task('cleanAll', function () {
    return del('dist/**/*');
});

gulp.task('copy:css', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/**/*.js',
        'node_modules/bootstrap/dist/**/*.css',
        'node_modules/bootstrap/fonts'
    ])
      .pipe(gulp.dest('dist/lib/css'))
});

gulp.task('copy:cssComponents', function () {
    return gulp.src('App/**/*.css')
      .pipe(gulp.dest('dist/App/'))
});

gulp.task('copy:libs', function () {
    return gulp.src([
         'node_modules/@angular/core/bundles/core.umd.js',
         'node_modules/@angular/common/bundles/common.umd.js',
         'node_modules/@angular/compiler/bundles/compiler.umd.js',
         'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',

         'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
         'node_modules/@angular/http/bundles/http.umd.js',
         'node_modules/@angular/router/bundles/router.umd.js',
         'node_modules/@angular/forms/bundles/forms.umd.js',

         'node_modules/systemjs/dist/system.src.js',
         'node_modules/rxjs/bundles/Rx.js',
         'node_modules/core-js/client/shim.min.js',
         'node_modules/zone.js/dist/zone.js',
         'node_modules/reflect-metadata/Reflect.js',
         'node_modules/systemjs/dist/system.src.js'
    ])
      .pipe(gulp.dest('dist/lib/@angular'))
});

gulp.task('copy:assets', function () {
    return gulp.src([
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/systemjs-cachebuster/src/system.cachebuster.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js'
    ])
     .pipe(gulp.dest('dist/lib/assets'))
})

gulp.task('copy:rxjs', function () {
    return gulp.src([
        'node_modules/rxjs/**/*.js',
    ])
      .pipe(gulp.dest('dist/lib/rxjs'))
});

// TypeScript compile
gulp.task('compile', ['clean', 'copy:rxjs', 'copy:libs', 'copy:assets', 'copy:css'], function () {
    return gulp
      .src('app/**/*.ts')
      .pipe(sourcemaps.init())          // <--- sourcemaps
      .pipe(typescript(tscConfig.compilerOptions))
      .pipe(sourcemaps.write('.'))      // <--- sourcemaps
      .pipe(gulp.dest('dist/app'));

});

gulp.task('compile-lite', [], function () {
    return gulp
      .src('app/**/*.ts')
      .pipe(sourcemaps.init())          // <--- sourcemaps
      .pipe(typescript(tscConfig.compilerOptions))
      .pipe(sourcemaps.write('.'))      // <--- sourcemaps
      .pipe(gulp.dest('dist/app'));
});

gulp.task('watch-signalr', function () {
    gulp.watch('AppSignalR/**/*.*', ['build:compile-signalr']);
});
gulp.task('build:compile-signalr', [], function () {
    return gulp
      .src('AppSignalR/**/*.ts')
      .pipe(sourcemaps.init())          // <--- sourcemaps
      .pipe(typescript(tscConfig.compilerOptions))
      .pipe(sourcemaps.write('.'))      // <--- sourcemaps
      .pipe(gulp.dest('dist/AppSignalR'));
});


gulp.task('build:build-lite', ['compile-lite', 'copy:cssComponents']);

gulp.task('build:buildAll', ['compile', 'copy:cssComponents']);

gulp.task('default', ['build:buildAll']);
