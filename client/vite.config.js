import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On the HR platform the app is mounted at hr.rdcc.ai/disc; everywhere else
// it sits at the root. Vite bakes `base` into the built asset URLs and
// exposes it to the client as import.meta.env.BASE_URL, which is what the
// router basename and the axios baseURL are derived from.
const base = process.env.BASE_PATH ? `${process.env.BASE_PATH}/` : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
