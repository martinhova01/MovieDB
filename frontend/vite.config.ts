/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/project2",
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        open: true,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "src/test/setup.ts",
        coverage: {
            //We do not test third party components, test-files, config-files or dist-folder.
            exclude: ["src/shadcn", "src/test", "*.config*", "dist"],
        },
    },
});
