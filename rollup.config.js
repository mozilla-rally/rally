/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

export default (cliArgs) => [
  {
    input: "src/background.js",
    output: {
      file: "dist/background.js"
    },
    plugins: [
      replace({
        // In Developer Mode, the study does not submit data and
        // gracefully handles communication errors with the Core
        // Add-on.
        __ENABLE_DEVELOPER_MODE__: !!cliArgs["config-enable-developer-mode"],
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  },
  {
    input: "src/content-script.js",
    output: {
      file: "dist/content-script.js"
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
    ],
  },
];
