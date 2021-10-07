const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass')(require('sass'));

//Paths
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/css/*.css",
    jsPath: "src/js/*.js",
    sassPath: "src/sass/*"
}

//convert scss to css and copy it to pub/css
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream());
}

//html-task: copy htmlfile to pub
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest('pub'));
}

//js-task: copy js file to pub/js and minimize it
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));
}

//watch-task: listen on changes
function watchTask() {

    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.jsPath, files.sassPath], parallel(copyHTML, jsTask, sassTask)).on('change',browserSync.reload);
}

exports.default = series(
    parallel(copyHTML, sassTask, jsTask),
    watchTask
);

