const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

gulp.task('transpileJS', function() {
  gulp
    .src('es6-js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./transpiled-js'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watch', ['browserSync'], function() {
  gulp.watch('es6-js/*.js', ['transpileJS']);
  gulp.watch('css/*.css', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});
