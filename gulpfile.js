"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
// const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
// const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
// const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
// const webpackstream = require("webpack-stream");
const fileinclude = require('gulp-file-include');
// const uglify = require("gulp-uglify");
const terser = require('gulp-terser');
var concat = require('gulp-concat');
const markdown = require('markdown');



// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./html/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./html/assets/", "./html/*.html"]);
}

// Optimize Images
function images() {
  return gulp
    .src("./src/assets/img/**/*")
    .pipe(newer("./html/assets/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./html/assets/img"));
}

// CSS task
function css() {
  return gulp
    .src("./src/assets/scss/style.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./html/assets/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./html/assets/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
// function scriptsLint() {
//   return gulp
//     .src(["./src/assets/js/**/*"])
//     .pipe(plumber())
//     // .pipe(eslint())
//     // .pipe(eslint.format())
//     // .pipe(eslint.failAfterError());
// }

// // Transpile, concatenate and minify scripts
// function scripts() {
//   return (
//     gulp
//       .src(["./src/assets/js/**/*"])
//       .pipe(plumber())
//       .pipe(webpackstream(webpackconfig, webpack))
//       // folder only, filename is specified in webpack config
//       .pipe(gulp.dest("./html/assets/js/"))
//       .pipe(browsersync.stream())
//   );
// }


function vendor(){
  return gulp
      .src([
         "node_modules/jquery/dist/jquery.js",
        // "node_modules/popper.js/dist/popper.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.js"
        // "node_modules/tiny-slider/dist/tiny-slider.helper.ie8.js",
        // "node_modules/tiny-slider/dist/tiny-slider.js",
        // "node_modules/mediaelement/build/mediaelement-and-player.js",
        
      ])
      .pipe(terser())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('./html/assets/js'));

}

function js(){
  return gulp
      .src([
        "./src/assets/js/**/*",
      ])
      .pipe(terser())
      .pipe(concat('main.js'))
      .pipe(gulp.dest('./html/assets/js'));

}

//fonts
function fonts() {
  return gulp
      .src([
        "./src/assets/fonts/**/*",
      ])
      .pipe(gulp.dest('./html/assets/fonts'));
}

// Jekyll
// function jekyll() {
//   return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
// }


function html() {
  return gulp
      .src(['./src/pages/**/*'])
      .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file',
          filters: {
            markdown: markdown.parse
          }
      }))
      .pipe(gulp.dest('./html/'));
}

// Watch files
function watchFiles() {
  gulp.watch("./src/assets/scss/**/*", css);
  gulp.watch("./src/assets/js/**/*", gulp.series(js, browserSyncReload));
  // gulp.watch(
  //   "./src/pages/**/*",
  //   // gulp.series(jekyll, browserSyncReload)
  // );
  gulp.watch("./src/assets/img/**/*", images);
  gulp.watch(['./src/pages/**/*.html'], gulp.series(html, browserSyncReload));
}


// define complex tasks
// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, gulp.parallel(css, fonts, images, vendor, js, html));
const watch = gulp.parallel(watchFiles, fonts, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.vendor = vendor;
exports.js = js;
exports.html = html;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;