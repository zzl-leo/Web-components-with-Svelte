import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: './src/lib/index.ts',
      name: 'MyLibrary',
      formats: ["es", "umd", "cjs"],
    }
  },
  plugins: [svelte({
    compilerOptions:{
      customElement: true
    }
  })]
})
