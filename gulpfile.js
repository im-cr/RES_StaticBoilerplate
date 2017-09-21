var gulp = require('gulp');


//plugins
var browserSync = require('browser-sync').create(),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    htmlmin = require('gulp-html-minifier'),
    inject = require('gulp-inject-string'),
    insert = require('gulp-file-insert'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    merge = require('merge'),
    nunjucksRender = require('gulp-nunjucks-render'),
    rename = require('gulp-rename'),
    replace = require('gulp-regex-replace'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    vinylPaths = require('vinyl-paths'),
    watch = require('gulp-watch');





// ------------------------------- DIR/FILE PATHS
var paths = {
    public   : "./app/__public/",
    html     : "./app/*.html",
    sass     : "./app/assets/css/sass/**/*.scss",
    css      : "./app/assets/css/",
    jsv      : "./app/assets/js/vendor/*.js",
    srcjs    : "./app/assets/js/src/*.js",
    js       : "./app/assets/js/",
    pages    : "./app/pages/**/*.nunjucks",
    jucks    : "./app/templates/**/*.nunjucks"
}

// ------------------------------- MARKUP TASKS
gulp.task('html',function(){
  return gulp.src(paths.html)
  .pipe(changed('./'));
});

//CSS TASKS
//----------------------------------------------
gulp.task('styles',function(){
   return gulp.src(paths.sass)
   .pipe(changed(paths.css))
   .pipe(plumber())
   .pipe(sass())
   .pipe(prefix('last 2 versions'))
   .pipe(cssmin())
   .pipe(rename('style.public.css'))
   .pipe(gulp.dest(paths.public))
   .pipe(rename('style.min.css'))
   .pipe(gulp.dest(paths.css));
});


//JS TASKS
//----------------------------------------------
gulp.task('scripts',function(){
  var myjs = gulp.src(paths.srcjs)
   .pipe(changed(paths.srcjs))
   .pipe(concat('scripts.js'))
   .pipe(gulp.dest(paths.js));

   var vendorjs = gulp.src(paths.jsv)
   .pipe(concat('vendor.js'))
   .pipe(changed(paths.jsv))
   .pipe(gulp.dest(paths.js));

   //merge streams
   return merge(myjs);
});

//NUNKJUCKS HTML TASK
//----------------------------------------------
gulp.task('nunjucks', function() {

  // Gets .html and .nunjucks files in pages
  return gulp.src(paths.pages)
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['./app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('./app/__public'))
});


//WATCH TASKS
//----------------------------------------------
gulp.task('watch',function(){
   var server = browserSync.reload;
  // Gulp watches for changes in styles for triggering 'styles' function
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.srcjs,['scripts']);
  gulp.watch(paths.html,['html']);
  gulp.watch(paths.pages,['nunjucks']);
  gulp.watch(paths.jucks,['nunjucks']);
});

//CONNECT TO SERVER
//-----------------------------------------------
gulp.task('webserver',function(){

  var reload = browserSync.reload;

  browserSync.init({
    port: 9001,
    open: false,
    server: "./app/__public",
    //browser: ["google chrome", "safari"]
  });
  gulp.watch([paths.html,paths.sass,paths.srcjs,paths.jucks,paths.pages]).on('change', reload);
});

//Live Reload
//----------------------------------------------
gulp.task('livereload',function(){
   gulp.src([paths.sass,paths.srcjs,paths.html,paths.jucks,paths.pages])
   .pipe(watch())
   .pipe(connect.reload());
});


//DEFAULT TASK
//----------------------------------------------
gulp.task('default',['watch','webserver','styles','nunjucks','scripts']);
