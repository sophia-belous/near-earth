'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const wiredep = require('wiredep').stream;
const inject = require('gulp-inject');
const series = require('stream-series');
const gls = require('gulp-live-server');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cache = require('gulp-angular-templatecache');
const eventStream = require('event-stream');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const modifyCssUrls = require('gulp-modify-css-urls');

const config = {
    name: 'near-earth',
    pathFonts: 'bower_components/font-awesome/fonts/*',
    pathJs: [
        'app/**/*.mod.js',
        'app/**/*.conf.js',
        'app/**/constants/*.js',
        'app/**/*.dir.js',
        'app/**/*.svc.js',
        'app/**/*.ctrl.js',
        'app/**/*.flt.js'
    ],
    pathLibs: [
        'bower_components/moment/min/moment-with-locales.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-moment/angular-moment.min.js',
        '!bower_components/angular-material/modules/**/*.min.js'

    ],
    pathCSs: [
        'app/*.css',
        'bower_components/angular-material/*.css',
        'bower_components/font-awesome/css/font-awesome.css'
    ]
};

gulp.task('development', ['inject-dev', 'server']);
gulp.task('production', ['inject-prod', 'server']);

gulp.task('inject-dev', ['compile-sass', 'server'], function () {
    const target = gulp.src('index.tpl.html').pipe(rename('index.html'));
    const sources = gulp.src([
        'app/**/*.mod.js',
        'app/**/*.conf.js',
        'app/**/constants/*.js',
        'app/**/*.dir.js',
        'app/**/*.svc.js',
        'app/**/*.ctrl.js',
        'app/**/*.flt.js',
        'bower_components/font-awesome/css/font-awesome.css',
        'app/**/*.css']);
    return target.pipe(wiredep())
        .pipe(inject(series(sources), {
            transform: (filepath, file, i, length) => {
                return inject.transform.apply(inject.transform, arguments);
            }
        }))
        .pipe(gulp.dest(''));
});

gulp.task('inject-prod', ['prod-css', 'prod-js'], () => {
    const target = gulp.src('index.tpl.html').pipe(rename('index.html'));
    const sources = gulp.src(['prod/libs.*', 'prod/bundle.*'], { read: false });
    return target
        .pipe(inject(series(sources)))
        .pipe(gulp.dest(''));
});

gulp.task('prod-js', ['libs'], () => {
    return gulp.src(config.pathJs)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('bundle.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('prod/'));
});

gulp.task('libs', () => {
    return gulp.src(config.pathLibs)
        .pipe(concat('libs.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('prod/'));
});

gulp.task('compile-sass', () => {
    return gulp.src('app/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/'));
});

gulp.task('neo-css', ['compile-sass'], () => {
    return gulp.src(config.pathCSs)
        .pipe(concat('bundle.css'))
          .pipe(modifyCssUrls({
            modify: (url, filePath) => {
                if (url.indexOf('../fonts') !== -1) {
                    return url.replace('../fonts', 'fonts')
                }
                return url;
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('prod/'));
});

gulp.task('prod-css', ['neo-css', 'fonts']);

gulp.task('fonts', () => {
    gulp.src(config.pathFonts)
        .pipe(gulp.dest('prod/fonts'));
});

gulp.task('server', () => {
    const server = gls.new('index.js');
    server.start();
});
