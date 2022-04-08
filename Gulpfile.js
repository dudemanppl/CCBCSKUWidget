const { src, dest, series, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const removeCode = require('gulp-remove-code');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');
const {
  env: { NODE_ENV },
} = require('process');

const production = NODE_ENV === 'production';

const contentScripts = [
  'src/index.js',
  'src/shared/index.js',
  'src/pdp/copySKUButton.js',
  'src/pdp/index.js',
  'src/plp/dropdown/dropdownCaret.js',
  'src/plp/dropdown/container.js',
  'src/plp/dropdown/dropdown.js',
  'src/plp/dropdown/singleOption.js',
  'src/plp/index.js',
];

const terserOptions = {
  mangle: {
    toplevel: true,
  },
  compress: { ecma: 8 },
};

const concatOptions = { newLine: ' ' };

const destLocation = 'dist/minified';

const minifyCSS = (cb) => {
  src('src/**/*.css')
    .pipe(cleanCSS())
    .pipe(concat('index.min.css', concatOptions))
    .pipe(dest(destLocation));

  cb();
};

const minifyJSContentScripts = (cb) => {
  src(contentScripts)
    .pipe(removeCode({ production: true }))
    .pipe(concat('index.min.js', concatOptions))
    .pipe(gulpif(production, terser(terserOptions)))
    .pipe(dest(destLocation));

  cb();
};

const minifyJSBackgroundScript = (cb) => {
  const backgroundScripts = ['src/shared/changeIcon.js'];
  !production && backgroundScripts.push('hot-reload.js');

  src(backgroundScripts)
    .pipe(concat('changeIcon.min.js'), concatOptions)
    .pipe(terser(terserOptions))
    .pipe(dest(destLocation));

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
    minifyJSContentScripts,
    minifyJSBackgroundScript,
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

exports.dev = dev;

exports.default = build;
