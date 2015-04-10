var gulp = require('gulp');
// var minifyHTML = require('gulp-minify-html'); // minifikacja html
var concat = require('gulp-concat');// konkatenacja (łączenie plików w 1)

var jshint = require('gulp-jshint');// sprawdzanie błędów w js
var stylish = require('jshint-stylish');
var mainBowerFiles = require("main-bower-files");// dołączenie glównych plików z "bower_components"
var uglify = require('gulp-uglify');// minifikacja jsów

var sass = require('gulp-sass');// sass->css
// var less = require('gulp-less');//less->css
var autoprefixer = require('gulp-autoprefixer');// dodawanie autoprefixerów
var cssmin = require('gulp-cssmin');// minifikacja cssów


var sourcemaps = require('gulp-sourcemaps');// określa oryginalne miejsca w kodzie (pierwotne pliki)

var imagemin = require('gulp-imagemin');// minifikacja obrazków

var debug = require('gulp-debug');
var merge = require('gulp-merge');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
// var plumber = require('gulp-plumber');// nie zatrzymuje działania choć napotka na bląd
 
var config = {
    paths: {
        html: {
            src:  ['src/**/*.html'],
            dest: 'build'
        },
        javascript: {
            src:  ['src/js/**/*.js'],
            dest: 'build/js'
        },
        css: {
            src: ['src/css/**/*.scss'],
            // src: ['src/css/**/*.less'],
            dest: 'build/css'
        },
        images: {
            src: ['src/img/**/*'],
            dest: 'build/img'
        }
    }
};

gulp.task('html', function(){
    return gulp.src(config.paths.html.src)
    .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task('lint', function() {
  return gulp.src(config.paths.javascript.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('scripts', function(){
        return merge(
          gulp.src(config.paths.javascript.src),
          gulp.src(mainBowerFiles())
        )
        .pipe(sourcemaps.init())
        .pipe(concat("script.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.javascript.dest));
});
 
gulp.task('css', function(){
    return gulp.src(config.paths.css.src)
    .pipe(sass())
    // .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.css'))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('image', function () {
    return gulp.src(config.paths.images.src)
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(config.paths.images.dest));
});

gulp.task('watch', function () { // obserwacja zmian i wywoływanie taska
  browserSync({
      server: {
          baseDir: config.paths.html.dest
      }
  });
  gulp.watch(config.paths.css.src, ['css']);
  gulp.watch(config.paths.javascript.src, ['lint', 'scripts']);
  gulp.watch(config.paths.html.src, ['html']);
  gulp.watch('build/**/*').on('change', reload);
});



gulp.task('default', ['watch', 'image']);


