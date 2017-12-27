var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    tailwindcss  = require('tailwindcss'),
    gulpSequence = require('gulp-sequence'),
    sass         = require('gulp-sass'),
    pug          = require('gulp-pug'),
    browserSync  = require('browser-sync').create();

var paths = {
    bower   : "./bower_components/",
    images  : "./images/",
    favicons: "./images/favicons/",
    fonts   : "./fonts/",
    scss    : "./src/css/",
    js      : "./js/",
    pug     : "./src/html/",
    dist    : "./dist/"
};

gulp.task('css', function () {
  return gulp.src(paths.scss + '[^_]*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      tailwindcss('./tailwind-config.js'),
      require('autoprefixer')
    ]))

    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: "./build"
    });

    gulp.watch("src/css/*.scss", ['css']);
    gulp.watch("src/html/*.pug", ['pug']).on('change', browserSync.reload);
});

gulp.task('html', function buildHTML() {
  return gulp.src(paths.pug + '[^_]*.pug')
  .pipe(pug({
    pretty: true 
  }))
  .pipe(gulp.dest(paths.dist))
});

gulp.task('default', ['serve']);

gulp.task('build', function (cb) {
  gulpSequence('clean', ['css', 'html'])(cb)
})