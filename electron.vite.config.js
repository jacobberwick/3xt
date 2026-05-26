import { defineConfig } from "electron-vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	main: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, "app/main/index.js"),
				},
			},
		},
	},
	preload: {
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, "app/preload/preload.js"),
				},
			},
		},
	},
	renderer: {
		root: "app",
		server: {
			port: 3000
		},
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, "app/index.html"),
				},
			},
		},
	},
});
