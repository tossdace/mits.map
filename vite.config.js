import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        academicTeam: resolve(import.meta.dirname, 'academic-team.html'),
        threeDMap: resolve(import.meta.dirname, '3d-map.html'),
      },
    },
  },
});
