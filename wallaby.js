export default function () {
  return {
    autoDetect: true,
    
    // Use your existing Vitest setup
    testFramework: {
      // Vitest config location
      configFile: './vitest.config.ts'
    },

    // Files to instrument (track coverage)
    files: [
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.test.ts',
      '!src/**/*.test.tsx',
      '!src/**/*.spec.ts',
      'src/test/**/*', // Include test factories/helpers
    ],

    // Test files
    tests: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'tests/**/*.test.ts',
    ],

    env: {
      type: 'node',
      runner: 'node',
    },

    // Ignore node_modules and build artifacts
    filesWithNoCoverageCalculated: [
      'src/**/*.d.ts',
      'src/data/definitions/**/*', // Skip data files
    ],
  };
}
