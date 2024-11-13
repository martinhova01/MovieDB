import { defineConfig } from "vitest/config";

export default defineConfig({
    cacheDir: "node_modules/.vitest",
    test: {
        include: ["src/**/*.test.ts"],
        coverage: {
            exclude: ["*.d.ts", "src/test", "*.config*", "dist"],
        },
    },
});
