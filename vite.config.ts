import { svelte } from "@sveltejs/vite-plugin-svelte"
import fs from 'fs/promises'
import { join } from "path"
import { defineConfig, PluginOption } from "vite"
import * as pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), updateScripts()],
  build: {
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',
        sidepanel: 'src/sidepanel/index.html',
      },
    },
  }
})

function updateScripts() {
  return {
    name: 'update scripts',
    async writeBundle({ dir }) {
      // update the background script import
      const files = JSON.parse(
        (await fs.readFile(join(dir, '.vite', 'manifest.json'))).toString())
      await fs.writeFile(join(dir, 'background.js'),
        `import './${files['src/background/index.ts'].file}'`)
      // update the manifest version
      const manifestPath = join(dir, '..', 'public', 'manifest.json')
      const manifest = JSON.parse((await fs.readFile(manifestPath)).toString())
      manifest.version = pkg.version
      const newManifest = JSON.stringify(manifest, null, 2)
      await fs.writeFile(manifestPath, newManifest)
      await fs.writeFile(join(dir, 'manifest.json'), newManifest)
    },
  } as PluginOption
}
