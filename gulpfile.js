'use strict';

var gulp = require('gulp'),
    pug = require('gulp-pug'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync').create();

var outputDir; 
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/'
}
var paths = {
  dist_files: outputDir + '/**/*.*',
  html: {
    src: 'src/*.html',
    dest: outputDir
  },
  styles: {
    src: 'src/styles/**/*.css',
    dest: outputDir + 'styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: outputDir + 'scripts/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: outputDir +'images/'
  },
  fonts: {
    src: 'src/fonts/**/*.{ttf,woff, woff2,eot,svg}',
    dest: outputDir + 'fonts/'
  }
};

var plugins = {
			browserSync: {
	    proxy: "localhost:3000",
	    port: 5000, 
	    files: [ 
	      paths.dist_files 
	    ],
	    browser: 'google chrome',
	    notify: true,
	    open: true
    },
      nodemon: {
      script: 'index.js',
      ignore: [
        'node_modules/'
      ]
    }
}

function clean() {
  return del([ outputDir ]);
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.html.dest));
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

function fonts() {
  return gulp.src(paths.fonts.src, { read: false })
  .pipe(gulp.dest(paths.fonts.dest));
}

function server(cb) {
  var called = false;
  return nodemon(plugins.nodemon)
  .on('start', function() {
    if(!called) {
      called = true;
      cb();
    }
  });
}

function browserSyncInit(done) {
  browserSync.init(plugins.browserSync);
  done();
}
function watch() {
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  browserSync.reload();
}

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.fonts = fonts;
exports.server = server;
exports.browserSyncInit = browserSyncInit;

//DEVELOPER
var dev = gulp.series(gulp.parallel(html, styles, scripts, images, fonts));
// PRODUCTION 
var prod = gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts));
//DEFAULT 
var def = gulp.series(clean, dev, server, gulp.parallel(watch, browserSyncInit));
//WATCH
gulp.task('dev', dev);
gulp.task('prod', prod);
gulp.task('default', def)