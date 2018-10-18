var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),

    config = {
        production: !!gutil.env.production,
        sass: {
            outputStyle: 'compressed'
        },
        concat: {
            newLine: '\r\n'
        }
    }
    input = {  
        stylesheet: 'src/scss/default.scss',
        javascript: Array('src/js/settings.js', 'src/js/main.js', 'src/js/**/*.js')
    }
    output = {
        stylesheet: 'dist/build/',
        javascript: 'dist/build/'
    },
    production = {
        stylesheet: 'dist/production/',
        javascript: 'dist/production/'
    },
    watch = {
        stylesheet: 'src/scss/**/*.scss',
        javascript: 'src/js/**/*.js'
    };

gulp.task('default', ['stylesheet', 'javascript', 'watch']);
gulp.task('watch', function(){
    gulp.watch(watch.stylesheet, ['stylesheet']);
    gulp.watch(watch.javascript, ['javascript']);
});
gulp.task('stylesheet', function(){
    console.log(gutil.env.type);
    
    return gulp.src(input.stylesheet)
            .pipe(gutil.env.type !== 'prod' ? sourcemaps.init() : gutil.noop())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(rename('repolished.css'))
            .pipe(gutil.env.type !== 'prod' ? sourcemaps.write() : gutil.noop())
            .pipe(gutil.env.type !== 'prod' ? gulp.dest(output.stylesheet) : gulp.dest(production.stylesheet));
});
gulp.task('javascript', function(){
    return gulp.src(input.javascript)
            .pipe(config.production ? sourcemaps.init() : gutil.noop())
            .pipe(concat('bundle.js', config.concat))
            .pipe(config.production ? gutil.noop() : uglify().on('error', gutil.log))
            .pipe(config.production ? sourcemaps.write() : gutil.noop())
            .pipe(config.production ? gulp.dest(output.javascript) : gulp.dest(production.javascript));
});