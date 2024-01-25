import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      exclude: 'src/App.svelte',
      compilerOptions: {
        customElement: true,
      },
    }),
    svelte({
      include: 'src/App.svelte',
      exclude: 'src/lib/**/*',
    }),
  ],
});
