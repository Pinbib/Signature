import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";

export default {
	input: "dist/index.js",
	output: {
		file: "bundle/index.js",
		plugins: [terser()]
	},
	external: [],
	plugins: [nodeResolve()]
};