const { src, dest, watch, parallel, series } = require("gulp");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const purgecss = require("gulp-purgecss");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");

// Clear dist
function clean() {
  return del("dist/");
}

// Convert html
function html() {
  return src("src/index.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

// Convert styles
function styles() {
  return src("src/scss/style.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      purgecss({
        content: ["src/*.html"],
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// Convert scripts
function scripts() {
  return src("src/js/app.js")
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// Image min
function images() {
  return src("src/img/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/img"))
    .pipe(browserSync.stream());
}

// Watch
function watching() {
  watch(["src/index.html"], html);
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/js/app.js"], scripts);
  watch(["src/img/*.*"], images);
  watch(["dist/*.html"]).on("change", browserSync.reload);
}

function reloadPage() {
  browserSync.init({
    server: {
      baseDir: "dist",
      port: 3000,
      keepalive: true,
    },
  });
}

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watching = watching;
exports.reloadPage = reloadPage;

exports.default = series(
  clean,
  parallel(html, styles, scripts, images, reloadPage, watching)
);

exports.dev = series(
  clean,
  parallel(html, styles, scripts, images, reloadPage, watching)
);

exports.build = series(clean, parallel(html, styles, scripts, images));
