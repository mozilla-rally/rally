
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/rally.ts',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        resolve({
            browser: true,
        }),
        typescript({ lib: ["es5", "es6", "dom"], target: "es6" }),
        commonjs()
    ]
};