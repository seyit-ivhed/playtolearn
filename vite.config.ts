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
          'vendor-router': ['react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['framer-motion', 'zustand', 'i18next', 'react-i18next', 'react-hook-form'],
          'vendor-ui': ['lucide-react'],
          'vendor-particles': ['tsparticles', '@tsparticles/react', '@tsparticles/slim'],
        },
      },
      onwarn(warning) {
        // Ignore circular dependency warnings from node_modules
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.message.includes('node_modules')) {
          return;
        }
        // Fail the build on any other rollup warnings
        throw new Error(warning.message);
      },
    },
  },
})
