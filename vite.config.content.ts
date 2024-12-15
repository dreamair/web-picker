import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'build',
    lib: {
      entry: 'src/content/index.ts',
      formats: ['iife'],
      name: 'content',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
      },
    },
    target: 'es6',
  },
})
