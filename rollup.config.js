import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from "@rollup/plugin-terser";
import {dts} from "rollup-plugin-dts";

export default [
	{
		input: "dist/index.js",
		output: [
			{
				file: "bundle/index.min.js",
				plugins: [terser()]
			}, {
				file: "bundle/index.js"
			}
		],
		external: [],
		plugins: [nodeResolve()]
	},
	{
		input: "dist/d/index.d.ts",
		output: {
			file: "bundle/d/index.d.ts"
		},
		external: [],
		plugins: [nodeResolve(), dts()]
	}
];