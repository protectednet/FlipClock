
const { defineConfig } = require('vite');

export default defineConfig({
  build: {
    lib: {
      entry: 'src',
      name: 'FlipClock',
      fileName: (format) => `flipclock.${format}.js`,
    }
  }
});