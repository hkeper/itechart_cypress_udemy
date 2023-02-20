const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "5v8tef",
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  pageLoadTimeout: 30000,
  reporter: "mochawesome",
  env: {
    url: "https://mailfence.com/",

  },
  retries: {
    runMode: 1,
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: "cypress/e2e/yandexTests/*.js",
    hideXHRInCommandLog: true
  },
});
