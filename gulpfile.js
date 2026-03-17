'use strict';

const build = require('@microsoft/sp-build-web');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// TSLint not supported in rush-stack-compiler-4.x — disabled
build.lintCmd.enabled = false;

build.initialize(gulp);

// Fix Windows EPERM on repeated package-solution runs.
// SPFx internal cleanRawPackageDirectoryAsync fails when Windows still holds
// a file lock on sharepoint/solution/debug/_rels from the previous build.
const debugDir = path.join(process.cwd(), 'sharepoint', 'solution', 'debug');
const originalPackageSolution = gulp.task('package-solution').unwrap();

gulp.task('clean-pkg-debug', function (done) {
  if (!fs.existsSync(debugDir)) { return done(); }
  var cmd = process.platform === 'win32'
    ? 'rmdir /s /q "' + debugDir + '"'
    : 'rm -rf "' + debugDir + '"';
  require('child_process').exec(cmd, function (err) {
    done(err && fs.existsSync(debugDir) ? err : undefined);
  });
});

gulp.task('package-solution', gulp.series('clean-pkg-debug', originalPackageSolution));
