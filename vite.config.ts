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
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['framer-motion', 'zustand', 'i18next', 'react-i18next'],
          'vendor-ui': ['lucide-react'],
          'vendor-particles': ['tsparticles', '@tsparticles/react', '@tsparticles/slim'],
        },
      },
      onwarn(warning) {
        // Fail the build on any rollup warnings
        throw new Error(warning.message);
      },
    },
  },
})
