'use strict';

var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	rigger       = require('gulp-rigger');

gulp.task('css-libs', function() {
	return gulp.src([
			'node_modules/normalize.css/normalize.css'
		])
		.pipe(concat('libs.css'))
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function() {
	return gulp.src('src/sass/main.sass')
		.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer(['last 15 versions'], {cascade: true}))
			.pipe(cssnano())
			.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('push', function() {
	return gulp.src('src/index.html')
		.pipe(rigger())
		.pipe(gulp.dest('dist'));
});

gulp.task('init', [
	'clean', 'clear', 'css-libs', 'sass', 'img', 'push'
]);

gulp.task('watch', function() {
	gulp.watch('src/sass/*.sass', ['sass']);
	gulp.watch('src/img/**/*', ['img']);
	gulp.watch('src/**/*.html', ['push']);
});

gulp.task('default', ['init', 'watch']);