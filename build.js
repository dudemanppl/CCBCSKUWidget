import { minify } from "terser";
import CleanCSS from "clean-css";
import { readFileSync, writeFileSync, createWriteStream } from "fs";
import archiver from "archiver";

const contentScripts = [
  "src/shared/index.js",
  "src/shared/changeIcon.js",
  "src/pdp/copySKUButton.js",
  "src/pdp/index.js",
  "src/plp/dropdown/BCDropdownCaret.js",
  "src/plp/dropdown/dropdownContainer.js",
  "src/plp/dropdown/dropdownOptions.js",
  "src/plp/dropdown/singleDropdownOption.js",
  "src/plp/index.js",
];

const CSSFilesToMinify = [
  "src/shared/shared.css",
  "src/plp/plp.css",
  "src/pdp/pdp.css",
];

const build = async () => {
  const { styles: minifiedCSS } = await new CleanCSS({
    returnPromise: true,
  }).minify(CSSFilesToMinify);

  const contentScriptsString = contentScripts
    .map((filename) => readFileSync(filename))
    .join("\n");

  const backgroundScriptString = readFileSync(
    "src/shared/changeIcon.js",
    "utf8"
  );

  const terserOptions = {
    mangle: {
      toplevel: true,
    },
    compress: { ecma: 8 },
  };

  const { code: minifiedContentScripts } = await minify(
    contentScriptsString,
    terserOptions
  );

  const { code: minifiedBackgroundScript } = await minify(
    backgroundScriptString,
    terserOptions
  );

  writeFileSync("dist/minified/minified.js", minifiedContentScripts);

  writeFileSync("dist/minified/miniChangeIcon.js", minifiedBackgroundScript);

  writeFileSync("dist/minified/minified.css", minifiedCSS);

  const output = createWriteStream("dist/CCBCSKUWidget.zip");
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.pipe(output);
  archive.directory("dist/minified", false);
  archive.finalize();
};

build();
