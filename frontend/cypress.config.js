import { defineConfig } from "cypress";
import { configurePlugin } from "cypress-mongodb";

export default defineConfig({
    env: {
        mongodb: {
            uri: "mongodb://127.0.0.1:28017/",
            database: "test",
        },
    },
    e2e: {
        async setupNodeEvents(on, config) {
            configurePlugin(on);
        },
        baseUrl: "http://localhost:5173/project2",
        specPattern: "src/test/cypress/e2e/**/*.cy.ts",
        supportFile: "src/test/cypress/support/e2e.ts",
        fixturesFolder: "src/test/cypress/fixtures",
    },
});
