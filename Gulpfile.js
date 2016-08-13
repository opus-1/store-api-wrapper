'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const mocha = require('gulp-mocha');

gulp.task('test', ["compile"], () => 
    gulp.src('tests/*.js', {read: false})
        .pipe(mocha({jQuery: {}, reporter: 'spec', growl: true}))
);

gulp.task('compile', ()=> {
  return gulp.src('src/**/*.js')
             .pipe(sourcemaps.init())
             .pipe(babel({
                 presets: ['es2015']
             }))
             .pipe(concat('dist.js'))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'));
});

gulp.task('watch', ()=>{
  gulp.watch('src/*.js', ['test'])
  gulp.watch('src/**/*.js', ['test'])
  return gulp.watch('tests/*.js', ['test'])
});

gulp.task('default', ["compile", "watch", "test"])