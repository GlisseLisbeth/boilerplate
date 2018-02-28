var gulp = require('gulp');
var pug = require('gulp-pug');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var imagemin = require('gulp-imagemin');

var paths = {
  html: {
    src: 'src/*.html',
    dest: 'assets/'
  },
  styles: {
    src: 'src/styles/**/*.css',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'assets/images/'
  }
};

function clean() {
  return del([ 'assets' ]);
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.html.dest))
}
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
}

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;

var build = gulp.series(clean, gulp.parallel(html, styles, scripts, images));

gulp.task('build', build);
