import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',

    // Performance optimizations
    pool: 'threads', // Use worker threads for parallel execution
    poolOptions: {
      threads: {
        // Use all available CPU cores minus 1
        minThreads: 1,
        maxThreads: undefined, // Auto-detect based on CPU cores
        useAtomics: true, // Better performance for shared memory
      },
    },

    // Test isolation and caching
    isolate: true, // Isolate tests for safety
    cache: {
      dir: 'node_modules/.vitest', // Cache compiled test files
    },

    // Faster test execution
    testTimeout: 5000, // 5s default timeout (down from unlimited)
    hookTimeout: 10000, // 10s for hooks
    teardownTimeout: 1000, // 1s for teardown

    // Coverage optimizations
    coverage: {
      provider: 'v8', // Faster than c8
      reporter: ['text', 'json-summary', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/test/**',
        '**/tests/**',
        '**/e2e/**',
        '**/*.config.ts',
        '**/mockServiceWorker.js',
        'src/test/**', // Exclude test utilities from coverage
        'apps/**',
        'crates/**',
        'scripts/**',
        'story/**',
        '**/*.stories.tsx', // Storybook files
        '**/storyboards/**',
        'src/ui/sprites/types-generated.ts',
        '**/constants.ts',
      ],
      // Only collect coverage for source files
      include: [
        'src/**/*.{ts,tsx}',
      ],
      // Skip coverage for files with 100% coverage (speeds up)
      skipFull: true,
      // Thresholds for CI
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 50,
        lines: 60,
      },
    },

    // Exclude E2E tests (handled by Playwright)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      'tests/e2e/**', // E2E tests
      '**/playwright-report/**',
    ],

    // Reporter optimizations
    reporters: process.env.CI
      ? ['default', 'junit']
      : ['default'],
    outputFile: process.env.CI
      ? { junit: 'test-results/junit.xml' }
      : undefined,

    // Watch mode optimizations (for development)
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.git/**',
      '**/playwright-report/**',
    ],

    // Performance hints
    slowTestThreshold: 300, // Warn about tests slower than 300ms

    // Setup files for shared test configuration
    setupFiles: ['./tests/setup.ts'],
  },

  // Build optimizations that also affect test performance
  optimizeDeps: {
    include: [
      'vitest',
      '@vitest/ui',
      'happy-dom',
      'fast-check', // Pre-bundle for property tests
    ],
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@test': path.join(__dirname, 'src/test'),
    },
  },
});