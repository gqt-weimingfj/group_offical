var gulp = require('gulp');
var	sass = require('gulp-sass');//sass 编译选择压缩配置 ，不再使用css 压缩
var	sourcemaps = require('gulp-sourcemaps');
var	autoprefix = require('gulp-autoprefixer');
var	cssmin = require('gulp-clean-css');
var	concat = require('gulp-concat');
var	rename = require('gulp-rename');
var	jsmin = require('gulp-uglify');
var	clean = require('gulp-clean');
var	bs = require('browser-sync').create();


var cf = {
	pageStyleSrc: ['./src/sass/pages/**/*.scss'],
	pageStyleDest: './dist/css/pages/',
};

function d (){}

// 监听服务
function server (d){
	bs.init({
		server:'./dist/'
	});
	d()
}
// 公共js
function commonJs(d) {
	gulp.src([
			'./dist/lib/jquery/jQuery-min-1.11.2.js',
			'./dist/js/custom.js',
		])
		.pipe(concat('common.min.js'))
		.pipe(jsmin())
		.pipe(gulp.dest('./dist/js/'));
	d()
}

// 公共sass： 编译中转 合并第三方样式
function commonSass (){
	return gulp.src(['./src/sass/style.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefix({
			browsers: ['> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/css/'));
}
// 合并公共css
function commonCss (){
	return gulp.src([
			'./src/css/style.css',
		])
		.pipe(concat('style.css'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/css/'))
		.pipe(bs.reload({stream: true}));
}

// 页面样式
function pageStyle (d){
	gulp.src(cf.pageStyleSrc)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefix({
			browsers: ['> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(sourcemaps.write())
		// .pipe(cssmin())
		.pipe(gulp.dest(cf.pageStyleDest))
		.pipe(bs.reload({stream: true}));
	return d();
}

// 监听
function watcher (d){
	gulp.watch([
			'!src/sass/pages/**/*.scss',
			'src/sass/**/*.scss',
		],gulp.series(commonSass,commonCss));

	gulp.watch([
			'!src/sass/style.scss',
			'src/sass/**/*.scss',
		],pageStyle);

	gulp.watch([
			'./dist/js/custom.js'
		],commonJs);

	gulp.watch([
			'./dist/**/*.js',
			'./dist/**/*.html',
		]).on('change',bs.reload);
	return d();
}

// 清除样式
function cleanStyle (){
	return gulp.src([
			'./dist/css/',
			'./src/css/'
		]).pipe(clean());
}

gulp.task('clean',cleanStyle);

// gulp 
gulp.task(
	'default',
	gulp.parallel(
		server,
		commonJs,
		pageStyle,
		gulp.series(
			commonSass,
			commonCss,
			watcher
		)
	)
);
