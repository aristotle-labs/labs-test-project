var gulp = require('gulp');
var minifyCss = require('gulp-minify-css'); 
var minifyJs = require('gulp-minify');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

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