import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Run test files one at a time. Several files start Payload against the same database; in
    // parallel on an empty CI database they all try to create the schema at once and crash
    // ("type ... already exists").
    fileParallelism: false,
  },
})
