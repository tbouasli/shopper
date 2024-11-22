import "reflect-metadata";

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import swc from "unplugin-swc";

export default defineConfig({
	plugins: [tsconfigPaths(), swc.vite()],
	test: {
		root: ".",
		setupFiles: ["./e2e/setup.ts"],
		silent: false,
		fileParallelism: false,
		isolate: false,
	},
});
