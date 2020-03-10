var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('bundle-js', function() {
  return gulp.src(["dependencies.js", "01_helper_functions.js", "02_configuration.js",
  "03_helpers_towers.js", "04_worlds.js", "05_animation.js", "simulations.js"])
    .pipe(concat('bundled_files_for_simulations.js'))
    .pipe(gulp.dest('bundledJS'));
});
