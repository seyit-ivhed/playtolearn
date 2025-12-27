import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

const logger = createLogger()

logger.warn = (msg) => {
  // Fail the build on any warnings
  throw new Error(msg)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  customLogger: logger,
  build: {
    rollupOptions: {
      onwarn(warning) {
        // Fail the build on any rollup warnings
        throw new Error(warning.message);
      },
    },
  },
})
