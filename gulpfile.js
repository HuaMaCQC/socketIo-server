const gulp = require('gulp');
const fs = require('fs');

const ts = require('gulp-typescript');
const tsp = ts.createProject('tsconfig.json');
// const exec = require('child_process').exec;

const PATHS = {
    scripts: ['./src/**/*.ts'],
    // scripts: ['./src/demo.ts'],
    locals: ['./src/**/*.json'],
    output: './dist',
};

function buildTS() {
    return gulp.src(PATHS.scripts)
        .pipe(tsp())
        .pipe(gulp.dest(PATHS.output));
}

function copyLocales() {
    return gulp.src(PATHS.locals)
        .pipe(gulp.dest(PATHS.output));
}


function watch() {
    gulp.watch(PATHS.scripts, buildTS);
    // gulp.watch(PATHS.locals, gulp.parallel(copyLocales, buildTS));
    gulp.watch(PATHS.locals, function(done) {
        const json = JSON.parse(fs.readFileSync(__dirname + '/src/locales/zh-tw.json').toString());
        const res = {};
        const deep = (o, keys = []) => {
            Object.keys(o).forEach(k => {
                if (typeof o[k] === 'string') {
                    res[([...keys, k]).join('.')] = o[k];
                } else {
                    deep(o[k], [...keys, k]);
                }
            });
        }
        deep(json);
        fs.writeFileSync(__dirname + '/dist/locales/zh-tw.json', JSON.stringify(res));
        done();
    }, gulp.parallel(buildTS));
}


// gulp.task('default', gulp.parallel(buildTS, copyLocales, watch));
gulp.task('default', gulp.parallel(buildTS, watch));


