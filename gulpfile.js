var gulp = require("gulp");
var babel = require("gulp-babel");
var exec = require('child_process').exec;

gulp.task("es5ify", function() {
  return gulp.src("src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
