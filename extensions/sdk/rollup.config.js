import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

/**
  * Helper to detect developer mode.
  *
  * @param cliArgs the command line arguments.
  * @return {Boolean} whether or not developer mode is enabled.
  */
function isDevMode(cliArgs) {
    return Boolean(cliArgs["config-enable-developer-mode"]);
}

export default (cliArgs) => [
    {
        input: 'src/rally.ts',
        output: {
            name: "rally",
            file: 'dist/rally.js',
            format: 'es',
            sourcemap: isDevMode(cliArgs) ? "inline" : false
        },
        plugins: [
            replace({
                preventAssignment: true,
            }),
            resolve({
                browser: true,
            }),
            typescript({ lib: ["es5", "es6", "dom"], target: "es6" }),
            commonjs(),
            json()
        ],
    },
    {
        input: 'src/rally-content.ts',
        output: {
            file: 'dist/rally-content.js',
            format: 'es'
        },
        plugins: [
            replace({
                preventAssignment: true,
            }),
            resolve({
                browser: true,
            }),
            typescript({ lib: ["es5", "es6", "dom"], target: "es6" }),
            commonjs(),
            json()
        ],
    }
];