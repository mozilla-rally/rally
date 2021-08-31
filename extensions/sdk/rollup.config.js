import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

export default () => [
    {
        input: 'src/rally.ts',
        output: {
            name: "rally",
            file: 'dist/rally.js',
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