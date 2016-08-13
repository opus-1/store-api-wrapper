'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const mocha = require('gulp-mocha');

gulp.task('test', () => 
    gulp.src('tests/*.js', {read: false})
        .pipe(mocha({jQuery: {}}))
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
  return gulp.watch('src/*.js', ['compile', 'test'])
  return gulp.watch('src/**/*.js', ['compile', 'test'])
});

gulp.task('default', ["compile", "watch", "test"])