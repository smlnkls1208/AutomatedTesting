const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://dev.profteam.su",
        supportFile: "cypress/support/e2e.js",
        setupNodeEvents(on, config) {
            return config;
        },
        viewportWidth: 1920,
        viewportHeight: 1080,
        defaultCommandTimeout: 15000
    },
});