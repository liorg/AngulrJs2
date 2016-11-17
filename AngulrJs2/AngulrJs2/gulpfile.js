/* --1.*/
var gulp = require("gulp");
var ts = require("gulp-typescript");


//var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
//var tsify = require('tsify');


gulp.task("1_Common", function () {
    return gulp.src('ts/Common/*.ts')
        .pipe(ts({
            target: 'ES5'
        }))
        .js.pipe(gulp.dest("js/Common/"));
});

gulp.task("2_Account", function () {
    return gulp.src('ts/Account/*.ts')
        .pipe(ts())
        .js.pipe(gulp.dest("js/Account/"));
});

gulp.task('3_Browserify', function () {
    return browserify("js/Account/Account.js")
        .bundle()
        .pipe(source("./Comp/AccountCompiled.js"))
        .pipe(gulp.dest("./"));
});

gulp.task('0_Exec', ['1_Common', '2_Account', '3_Browserify']);
