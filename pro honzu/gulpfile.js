'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// TSLint not supported in rush-stack-compiler-4.x — disabled
build.lintCmd.enabled = false;

build.initialize(require('gulp'));
