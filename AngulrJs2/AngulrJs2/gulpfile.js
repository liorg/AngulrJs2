//http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html
var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var tscConfig = require('./tsconfig.json');
var tslint = require('gulp-tslint');
var gulpTypings = require("gulp-typings");
var sourcemaps = require('gulp-sourcemaps');
var cacheBuster = require('gulp-cache-bust');
var SystemJSCacheBuster = require("systemjs-cachebuster");

var cacheSysBuster = new SystemJSCacheBuster();

gulp.task("installTypings", function () {
    var stream = gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. 
    return stream; // by returning stream gulp can listen to events from the stream and knows when it is finished. 
});

gulp.task('cacheBuster', [], function () {
    return gulp.src('./index.html')
        .pipe(cacheBuster())
        .pipe(gulp.dest('.'));
});

gulp.task('cacheSysBuster', function () {
    return gulp
        .src('dist/App/**/*.js')
        .pipe(cacheSysBuster.full())
        .pipe(cacheSysBuster.incremental());
});

gulp.task('removeCache', ['cacheSysBuster', 'cacheBuster'], function () {

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

gulp.task('build', ['compile']);

gulp.task('default', ['build']);
