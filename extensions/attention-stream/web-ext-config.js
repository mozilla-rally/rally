/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This is the web-ext configuration for the Rally Attention Stream. It is
// part of the build system, and you should not have to modify it.

module.exports = {
  // Global options:
  verbose: true,
  // Command options:
  build: {
    overwriteDest: true,
  },
  run: {
    browserConsole: false
  },
  ignoreFiles: [
    "bin",
    "docs",
    "scripts",
    "src",
    "stories",
    "support",
    "tests",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "copyright.txt",
    "LICENSE",
    "package-lock.json",
    "package.json",
    "README.md",
    "rollup.config.*",
    "web-ext-config.js",
    "public/**/*.map",
    "tsconfig.json",
    "babel.config.cjs",
    "screenshots",
    "*.deb",
    "manifest.dev.json",
    "manifest.prod.json"
  ],
};
