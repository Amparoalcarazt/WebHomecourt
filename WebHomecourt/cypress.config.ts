import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "tq75d7",
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "https://sharkinovhomecourt.vercel.app/",
    viewportWidth: 1920,
    viewportHeight: 1020,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
