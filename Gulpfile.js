const { src, dest, series, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const gulpif = require('gulp-if');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');
const log = require('fancy-log');
const sass = require('gulp-sass')(require('sass'));

const {
  env: { NODE_ENV },
} = require('process');

const production = NODE_ENV === 'production';

const contentScripts = [
  // 'src/index.js',
  'src/shared/index.ts',
  // 'src/pdp/copySKUButton.js',
  // 'src/pdp/index.js',
  // 'src/plp/dropdown/BCDropdownCaret.js',
  // 'src/plp/dropdown/container.js',
  // 'src/plp/dropdown/dropdown.js',
  // 'src/plp/dropdown/singleOption.js',
  // 'src/plp/index.js',
];

const terserOptions = {
  mangle: {
    toplevel: true,
  },
  compress: { ecma: 8 },
};

const destLocation = 'dist/minified';

const sassCompilerOptions = {
  outputStyle: 'compressed',
};

const minifyCSS = (cb) => {
  src('src/sass/**/*.scss')
    .pipe(sass(sassCompilerOptions).on('error', sass.logError))
    .pipe(dest(`${destLocation}/index.min.css`));

  cb();
};

const minifyJSContentScripts = (cb) => {
  src(contentScripts)
    .pipe(
      ts({
        outFile: 'index.min.js',
        allowJs: true,
      })
    )
    .on('error', log)
    .pipe(dest(destLocation));

  cb();
};

const minifyJSBackgroundScript = (cb) => {
  const backgroundScripts = ['src/shared/changeIcon.js'];
  !production && backgroundScripts.push('hot-reload.js');

  src(backgroundScripts).pipe(terser(terserOptions)).pipe(dest(destLocation));

  cb();
};

const compressImages = (cb) => {
  src('src/images/*.png')
    .pipe(imagemin([imagemin.optipng({ optimizationLevel: 7 })]))
    .pipe(dest(`${destLocation}/images`));

  cb();
};

const zipFiles = (cb) => {
  src('dist/minified/**').pipe(zip('CCBCSKUWidget.zip')).pipe(dest('dist'));

  cb();
};

const build = series(
  parallel(
    minifyCSS,
    // minifyJSContentScripts,
    // minifyJSBackgroundScript,
    compressImages
  ),
  zipFiles
);

const dev = () => {
  const devWatchOpts = { ignoreInitial: false };

  watch('src/**/*.css', devWatchOpts, minifyCSS);
  watch(contentScripts, devWatchOpts, minifyJSContentScripts);
  watch('src/shared/changeIcon.js', devWatchOpts, minifyJSBackgroundScript);
  watch('src/images/*.png', devWatchOpts, compressImages);
};

module.exports = { default: minifyJSContentScripts, dev };
