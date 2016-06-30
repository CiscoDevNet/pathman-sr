'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	//sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	browserSync = require("browser-sync"),
	htmlmin = require("gulp-htmlmin"),
	reload = browserSync.reload;

var config = {
	// switch to false when in production mode
	debug: false
};

var pathmanSrBuildRoot = __dirname + "/../../client/pathman_sr/";

var path = {

	build: {
		index: pathmanSrBuildRoot,
		js: pathmanSrBuildRoot + 'js/',
		css: pathmanSrBuildRoot + '/css/',
		img: pathmanSrBuildRoot + '/media/img/',
		templates: pathmanSrBuildRoot + '/templates/',
		vendor: pathmanSrBuildRoot + '/vendor/'
	},
	src: {
		index: 'src/index.html',
		js: 'src/main.js',
		style: 'src/assets/less/main.less',
		img: 'src/media/img/**/*.*',
		templates: 'src/app/templates/**/*.*',
		vendor: 'src/vendor/**/*.*'
	},
	watch: {
		index: 'src/pathman_sr/index.html',
		js: 'src/pathman_sr/**/*.js',
		style: 'src/assets/less/**/*.less',
		img: 'src/media/img/**/*.*',
		templates: 'src/pathman_sr/app/templates/',
		vendor: 'src/vendor/**/*.*'
	},

	fileNames: {
		jsMinified: 'app.js',
		cssMinified: 'style.css'
	},

	clean: pathmanSrBuildRoot
};

gulp.task('clean', function () {
	del([path.clean], {force: true});
});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(rigger())
		//.pipe(sourcemaps.init())
		.pipe(uglify())
		//.pipe(sourcemaps.write())
		.pipe(rename(path.fileNames.jsMinified))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.style)
		//.pipe(sourcemaps.init())
		.pipe(less({
			includePaths: ['src/style/'],
			outputStyle: 'compressed',
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(prefixer())
		.pipe(cssmin())
		//.pipe(sourcemaps.write())
		.pipe(rename(path.fileNames.cssMinified))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('html:build', function(){

	// build index
	gulp.src(path.src.index)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.index));

	// build templates
	gulp.src(path.src.templates)
		.pipe(gulp.dest(path.build.templates))
		.pipe(reload({stream: true}));
});

gulp.task('vendor:build', function(){
	gulp.src(path.src.vendor)
		.pipe(gulp.dest(path.build.vendor))
});

gulp.task('build', [
	'html:build', // compile index.html
	'js:build', // assemble and minify js
	'style:build', // assemble and minify less/css
	'image:build', // just copy images
	'vendor:build' // copy vendor files
]);


gulp.task('watch', function(){
	watch([path.watch.index, path.watch.templates], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.vendor], function(event, cb) {
		gulp.start('vendor:build');
	});
});


gulp.task('default', ['clean'], function(){
	gulp.start('build');
	gulp.start('watch');
});