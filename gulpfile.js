var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var minifyCss = require('gulp-minify-css'); 
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

// Minify all html files
gulp.task('minify-html', function() {
  return gulp.src(['!views/*.min.html', 'views/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename(function (path) {
        path.extname = ".min.html"
    }))
    .pipe(gulp.dest('views'))
});

gulp.task('minify-js', function() {
  return gulp.src([
              'public/javascripts/ngProgress.js',
              'public/javascripts/app.js'
              ])
        .pipe(concat('labs-test-bundle.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./public/javascripts'))
})

gulp.task('minify-css', function() {
  return gulp.src(['public/stylesheets/ngProgress.css', 'public/stylesheets/site.css'])
          .pipe(concat('labs-test-bundle.min.css'))
          .pipe(minifyCss({
            keepSpecialComments: 0
          }))
          .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('watch', function() {
    gulp.watch(['!views/*.min.html', 'views/*.html'], ['minify-html'])
    gulp.watch(['!public/javascripts/labs-test-bundle.min.js', 'public/javascripts/*.js'], ['minify-js'])
    gulp.watch(['!public/stylesheets/labs-test-bundle.min.css', 'public/stylesheets/*.css'], ['minify-css'])
})

gulp.task('minify', ['minify-html', 'minify-js', 'minify-css'])

gulp.task('start', function () {
  var stream = nodemon({ script: 'server.js'
          , ext: 'html js'
          , ignore: []
          , tasks: ['lint'] })
 
  stream
      .on('restart', function () {
        console.log('restarted!')
      })
      .on('crash', function() {
        console.error('Application has crashed!\n')
         stream.emit('restart', 10)  // restart the server in 10 seconds 
      })
})