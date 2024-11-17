import { defineConfig } from "cypress";
import { configurePlugin } from "cypress-mongodb";

export default defineConfig({
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
