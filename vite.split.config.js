import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';


// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib: {
      entry: 'src/lib.ts',
      name: 'demoui',
      fileName: "demoui",
    },



    rollupOptions: {
    //   input: ['./src/lib/Counter.svelte', './src/lib/Leodemo.svelte'],

        external: [],
        output: {
            globals: {},
            format: 'esm',
            exports: 'named',
        },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    })
  ]
});


// npm run build -- -c=vite.split.config.js