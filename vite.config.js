import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        classrooms: resolve(import.meta.dirname, 'classrooms.html'),
        labs: resolve(import.meta.dirname, 'labs.html'),
        essentials: resolve(import.meta.dirname, 'essentials.html'),
        staffRooms: resolve(import.meta.dirname, 'staff-rooms.html'),
        academicTeam: resolve(import.meta.dirname, 'academic-team.html'),
        threeDMap: resolve(import.meta.dirname, '3d-map.html'),
        profile: resolve(import.meta.dirname, 'profile.html'),
        login: resolve(import.meta.dirname, 'login.html'),
      },
    },
  },
});
