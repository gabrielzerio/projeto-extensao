import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Corrige __dirname para ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.', // raiz do projeto (ajuste se necessário)

  build: {
    rollupOptions: {
      input: {
        // Corrige caminhos relativos
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'src/pages/game.html'),
        reactTest: resolve(__dirname, 'reactTest.html'),
        // ...outras páginas
      }
    },
  }
});