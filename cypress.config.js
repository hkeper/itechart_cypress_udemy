const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "5v8tef",
  chromeWebSecurity: false,
  defaultCommandTimeout: 180000,
  pageLoadTimeout: 180000,
  reporter: "mochawesome",
  env: {
    url: "https://mailfence.com/",
    shop_url: "https://rahulshettyacademy.com/angularpractice"

  },
  retries: {
    runMode: 1,
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: "cypress/e2e/*Tests/*.js",
    hideXHRInCommandLog: true
  },
});
