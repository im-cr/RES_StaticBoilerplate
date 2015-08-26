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
    rename = require('gulp-rename'),
    replace = require('gulp-regex-replace'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    vinylPaths = require('vinyl-paths'),
    watch = require('gulp-watch');





// ------------------------------- DIR/FILE PATHS
var paths = {
   html    : "./app/*.html",
   sass    : "./app/assets/css/sass/**/*.scss",
   css     : "./app/assets/css/",
   jsv     : "./app/assets/js/vendor/*.js",
   srcjs   : "./app/assets/js/src/*.js",
   js      : "./app/assets/js/"
}

// ------------------------------- MARKUP TASKS
gulp.task('html',function(){
  return gulp.src(paths.html)
  .pipe(changed('./'));
});

// ------------------------------- CSS TASKS
//compile sass
gulp.task('styles',function(){
   return gulp.src(paths.sass)
   .pipe(changed(paths.css))
   .pipe(plumber())
   .pipe(sass())
   .pipe(prefix('last 2 versions'))
   .pipe(cssmin())
   .pipe(rename('style.min.css'))
   .pipe(gulp.dest(paths.css));
});


// ------------------------------- JS TASKS
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
   return merge(myjs,vendorjs);
});

//Watch the sass file changes
//----------------------------------------------
gulp.task('watch',function(){
   var server = livereload();
  // Gulp watches for changes in styles for triggering 'styles' function
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.srcjs,['scripts']);
  gulp.watch(paths.html,['html']);
});

//CONNECT TO SERVER
//-----------------------------------------------
gulp.task('webserver',function(){
   /*connect.server({
      root: 'app',
      port: 9001,
      livereload : true
   });
  */

  var reload = browserSync.reload;
  browserSync.init({
    port: 9001,
    server: "./app",
    open: false
    //proxy: "yourlocal.dev"
  });
  gulp.watch([paths.html,paths.sass,paths.srcjs]).on('change', reload);

});

gulp.task('livereload',function(){
   gulp.src([paths.sass,paths.srcjs,paths.html])
   .pipe(watch())
   .pipe(connect.reload());
});

gulp.task('default',['webserver','styles','livereload','scripts','watch']);
