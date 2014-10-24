// Node modules
var fs = require('fs'),
    vm = require('vm'),
    merge = require('deeply'),
    chalk = require('chalk'),
    es = require('event-stream'),
    mergeStream = require('merge-stream'),
    runSequence = require('run-sequence'),
    del = require('del'),
    browserSync = require('browser-sync');

// Gulp and plugins
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

// Config
var browserSyncConfig = {
    server: {
        baseDir: './src'
    },
    port: 8080,
    open: true,
    watchOptions: {
        interval: 1500,
        debounceDelay: 1000
    },
    ghostMode: {
        clicks: false,
        location: false,
        forms: false,
        scroll: false
    },
    host: 'localhost'
};

var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home',
            'text!components/about-page/about.html'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });

// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function() {
    return gulp.src(['**/*.ts','!node_modules/**/*.ts'])
        .pipe(plugins.tsc({
            module: 'amd',
            target: 'ES5',
            sourcemap: true,
            emitError: false,
            keepTree: false,
            tmpDir: '.tmp',
            outDir: './'
        }))
        .pipe(gulp.dest('./'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', ['ts'], function () {
    return plugins.requirejsBundler(requireJsOptimizerConfig)
        //.pipe(plugins.uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-fonts', function() {
    return gulp.src(['./src/bower_modules/components-bootstrap/fonts/*'])
        .pipe(gulp.dest('./dist/fonts/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', ['copy-fonts'], function () {
    return gulp.src(['src/bower_modules/components-bootstrap/css/bootstrap.css','src/css/styles.css'])
        .pipe(plugins.replace('/fonts/', './fonts/'))
        .pipe(plugins.concat('css.css'))
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(plugins.htmlReplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

// Removes all files from ./dist/
gulp.task('clean', function(done) {
    del(['./dist/**', './tmp/**'], done);
});

gulp.task('browser-sync', function() {
    browserSync(browserSyncConfig);
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(['./src/**/*.ts'], ['ts'])
        .on ('change', function(file) {
            browserSync.reload(file.path);
        })
        .on('error', function(e){
            chalk.red('[ERROR]' + e.toString());
        });

    gulp.watch(['./src/css/*.css'], ['css'])
        .on('change', function(file){
            browserSync.reload(file.path, { stream: true });
        });
});

gulp.task('default', ['html', 'js', 'css', 'watch'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
