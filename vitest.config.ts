import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome',
      provider: 'webdriverio',
      providerOptions: {},
    },
    globals: true,
    setupFiles: ['vitest-setup.ts'],
  },
})
