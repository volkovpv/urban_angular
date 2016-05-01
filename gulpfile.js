/**
 * Created by volkovpv on 05.2016.
 */

'use strict';

var gulp                = require('gulp'),
  concat                = require('gulp-concat'),
  liveReload            = require('gulp-livereload'),
  ngAnnotate            = require('gulp-ng-annotate'),
  sourcemaps            = require('gulp-sourcemaps'),
  uglify                = require('gulp-uglify'),
  less                  = require('gulp-less'),
  ghtmlSrc              = require('gulp-html-src'),
  htmlreplace           = require('gulp-html-replace'),
  unhtml                = require('gulp-minify-html'),
  ngDocs                = require('gulp-ngdocs'),
  prefix    		 	      = require('gulp-autoprefixer'),
  cssmin			 	        = require('gulp-cssmin'),
  spaServer             = require('spa-server'),
  fs                    = require('fs'),
  replace               = require('gulp-replace'),
  LessPluginCleanCSS    = require('less-plugin-clean-css'),
  LessPluginAutoPrefix  = require('less-plugin-autoprefix'),
  cleancss              = new LessPluginCleanCSS({ advanced: true }),
  lessAutoprefix        = new LessPluginAutoPrefix({ browsers: ["last 5 versions"] });

var FILE_ENCODING = 'utf-8',
  EOL = '\n',
  server = spaServer.create({
    path: './dist',
    port: 8003,
    fallback: {
      'text/html' : '/index.html'
    }
  });

/**
 * @name vendor
 * @summary install bower components and copy them into the folder vendor
 */
gulp.task('vendor', function () {
  var fileArr = [];

  //'./src/app/core/app.ctrl.js'

  fs.readFile('./src/app/core/config.router.js', FILE_ENCODING, readVendor);
  fs.readFile('./src/app/core/app.ctrl.js', FILE_ENCODING, readVendor);


  function readVendor(err,data){
    var i               = 0,
      linkFile        = "",
      linkOutDir      = "",
      inFile          = "",
      arrDirFile      = [],
      len             = 0,
      fileName        = "",
      stringDir       = "",
      fullPathDir     = "",
      appFullPathDir  = "";

    if (err) {
      return console.log(err);
    }

    fileArr = data.match(/'vendor\/(.+?)'/g);
    if(!fileArr){
      console.log("======= no vendor =======");
      return;
    }
    i = fileArr.length;

    while(i--){
      linkFile = fileArr[i].replace(/'vendor\//g, 'src/vendor/').replace(/'/g, '');
      linkOutDir = fileArr[i].replace(/'vendor\//g, '').replace(/'/g, '');
      arrDirFile = linkOutDir.split('\/');
      len = arrDirFile.length-1;
      fileName = arrDirFile.splice(len);
      stringDir = arrDirFile.join('\/');
      fullPathDir = './dist/vendor/'+stringDir;
      appFullPathDir = './src/vendor/'+stringDir;
      gulp.src(linkFile)
        .pipe(gulp.dest(fullPathDir))
        .pipe(gulp.dest(appFullPathDir));
    }
  }
});

/**
 * @name html-replace-and-min
 * @summary Change in the file index.html css dependencies one dependency 'app.min.css'. Change in the file index.html js dependencies one dependency 'app.min.js'. Minification index.html.
 */
gulp.task('html-replace-and-min', function() {
  gulp.src('./src/index.html')
    .pipe(htmlreplace({
      'css': ['styles/vendor.min.css', 'styles/app.min.css'],
      'js': 'scripts/app.min.js'
    }))
    .pipe(unhtml({spare:true}))
    .pipe(gulp.dest('./dist'));
});
