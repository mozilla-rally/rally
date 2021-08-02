import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';


const RALLY_HOST = "rally-web-spike.web.app";

export default {
    input: 'src/rally.ts',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        replace({
            __RALLY_HOST__: RALLY_HOST,
            __RALLY_BASE_URL__: `https://${RALLY_HOST}`,
            preventAssignment: true
        }),
        resolve({
            browser: true,
        }),
        typescript({ lib: ["es5", "es6", "dom"], target: "es6" }),
        commonjs(),
        json()
    ]
};