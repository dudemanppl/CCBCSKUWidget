const { src, dest, series, parallel } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const zip = require("gulp-zip");

const contentScripts = [
  "src/shared/index.js",
  "src/pdp/copySKUButton.js",
  "src/pdp/index.js",
  "src/plp/dropdown/BCDropdownCaret.js",
  "src/plp/dropdown/dropdownContainer.js",
  "src/plp/dropdown/dropdownOptions.js",
  "src/plp/dropdown/singleDropdownOption.js",
  "src/plp/index.js",
];

const terserOptions = {
  mangle: {
    toplevel: true,
  },
  compress: { ecma: 8 },
};

const destLocation = "dist/minified";

const minifyCSS = () => {
  return src("src/**/*.css")
    .pipe(cleanCSS())
    .pipe(concat("index.min.css", { newLine: "" }))
    .pipe(dest(destLocation));
};

const minifyJSContentScripts = () => {
  return src(contentScripts)
    .pipe(concat("index.min.js", { newLine: "" }))
    .pipe(terser(terserOptions))
    .pipe(dest(destLocation));
};

const minifyJSBackgroundScript = () => {
  return src("src/shared/changeIcon.js")
    .pipe(rename("changeIcon.min.js"))
    .pipe(terser(terserOptions))
    .pipe(dest(destLocation));
};

const compressImages = () => {
  return src("src/images/*.png")
    .pipe(imagemin([imagemin.optipng({ optimizationLevel: 7 })]))
    .pipe(dest(`${destLocation}/images`));
};

const zipFiles = () => {
  return src("dist/minified/**")
    .pipe(zip("CCBCSKUWidget.zip"))
    .pipe(dest("dist"));
};

exports.default = series(
  parallel(
    minifyCSS,
    minifyJSBackgroundScript,
    minifyJSContentScripts,
    compressImages
  ),
  zipFiles
);
