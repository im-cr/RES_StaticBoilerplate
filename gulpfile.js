var gulp = require('gulp');


//plugins
var sass = require('gulp-sass'),
   cssmin = require('gulp-cssmin'),
   changed = require('gulp-changed'),
   concat = require('gulp-concat'),
   watch = require('gulp-watch'),
   plumber = require('gulp-plumber'),
   prefix = require('gulp-autoprefixer'),
   uglify = require('gulp-uglify'),
   browserSync = require('browser-sync'),
   connect = require('gulp-connect');
   livereload = require('gulp-livereload');



var paths = {
   html    : "./app/*.html",
   sass    : "./app/assets/css/sass/**/*.scss",
   css     : "./app/assets/css/",
   jssrc   : "./app/assets/js/src/*.js",
   js      : "./app/assets/js/"
}

gulp.task('html',function(){
  return gulp.src(paths.html)
  .pipe(changed('./'))
  .pipe(livereload());
});

// COMPILE SASS
//-----------------------------------------------
gulp.task('styles',function(){
   return gulp.src(paths.sass)
   .pipe(plumber())
   .pipe(sass())
   .pipe(prefix('last 2 versions'))
   .pipe(cssmin())
   .pipe(gulp.dest(paths.css))
   .pipe(livereload());
});


//Minify JS SCRIPTS
//----------------------------------------------
gulp.task('scripts',function(){
   return gulp.src(paths.jssrc)
   .pipe(uglify())
   .pipe(concat('scripts.js'))
   .pipe(gulp.dest(paths.js));
});

//Watch the sass file changes
//----------------------------------------------
gulp.task('watch',function(){
   var server = livereload();
  // Gulp watches for changes in styles for triggering 'styles' function
  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.jssrc,['scripts']);
  gulp.watch(paths.html,['html']);
});

//CONNECT TO SERVER
//-----------------------------------------------
gulp.task('webserver',function(){
   connect.server({
      root: 'app',
      port: 9001,
      livereload : true
   });
});

gulp.task('livereload',function(){
   gulp.src([paths.sass, paths.jssrc,paths.html])
   .pipe(watch())
   .pipe(connect.reload());
});

gulp.task('default',['webserver','styles','scripts','livereload','watch']);
