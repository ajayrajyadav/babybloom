export default defineConfig({
    e2e: {
      baseUrl: 'http://localhost:5173',
      setupNodeEvents(on, config) {
        // optionally add node events
      },
    },
    env: {
      preserveCookies: true,
    },
  });