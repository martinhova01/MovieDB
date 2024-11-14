import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: "http://localhost:5173/project2",
        specPattern: "src/test/cypress/e2e/**/*.cy.ts",
        supportFile: "src/test/cypress/support/e2e.ts",
        fixturesFolder: "src/test/cypress/fixtures",
    },
});
