import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: false,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        skills: resolve(__dirname, 'skills.html'),
        achievements: resolve(__dirname, 'achievements.html'),
        journey: resolve(__dirname, 'journey.html'),
        signature: resolve(__dirname, 'signature.html'),
        contact: resolve(__dirname, 'contact.html'),
        widescreen: resolve(__dirname, 'widescreen.html'),
        resume: resolve(__dirname, 'resume.html'),
        intro: resolve(__dirname, 'intro.html'),
      },
    },
  },
});
