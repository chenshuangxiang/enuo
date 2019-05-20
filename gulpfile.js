var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
//var uglify = require('gulp-uglify');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var assetRev = require('gulp-asset-rev');
var imageMin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');

function gulpScripts(app_name) {
    return gulp.src([app_name + '/**/*.js']) //源文件下的所有js
        .pipe(assetRev())                    //配置版本号
        //.pipe(uglify())                    //进行压缩，如果需要合并也可加上合并的代码
        .pipe(gulp.dest("app_upload"));//复制到目标文件路径
}

function gulpStyles(app_name) {
    return gulp.src([app_name + '/**/*.css'])
        .pipe(assetRev())
        .pipe(minifyCss())
        .pipe(gulp.dest("app_upload"));
}
function gulpImages(app_name) {
    return gulp.src([app_name + '/**/img/*',app_name + '/**/img/**/*',app_name + '/**/option/*'])
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest("app_upload"));   //复制所有图片到目标文件夹
}

function gulpRevHtml(app_name) {
    gulp.src([app_name + '/*.html', app_name + '/**/*.html'])   //源文件下面是所有html
        .pipe(assetRev())                                       //配置引用的js和css文件，需要的话也可以用minifyHtml压缩html文件
        .pipe(htmlmin({removeComments: true,collapseWhitespace: true,}))
        .pipe(gulp.dest('app_upload'));                   //打包到目标文件夹路径下面
}

gulp.task('app_scripts', function(){
    gulpScripts("app");
});
gulp.task('app_styles', function(){
    gulpStyles("app");
});
gulp.task('app_images',function(){
    gulpImages("app");
});
gulp.task('app_rev', ['app_styles', 'app_scripts'], function(){
    gulpRevHtml("app");
});
gulp.task('clean', del.bind(null, ['app_upload'], {
    force: true
}));
gulp.task("beike", function() {
    runSequence('clean', ["app_images", "app_rev"]); //先清除，在异步执行
});

gulp.task('default',['beike']);