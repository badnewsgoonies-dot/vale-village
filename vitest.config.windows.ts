// Alternative minimal config for Windows troubleshooting
// Try: npx vitest run --config vitest.config.windows.ts

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // Try without setupFiles first to isolate the issue
    // setupFiles: [path.resolve(__dirname, 'tests', 'setup.ts')],
    // Explicit patterns for Windows
    include: [
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      '**/tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    // Explicit exclude patterns
    exclude: ['node_modules', 'dist', '.idea', '.vscode'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})