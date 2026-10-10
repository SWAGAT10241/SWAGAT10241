import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SWAGAT10241/',
  build: { outDir: 'dist', sourcemap: false },
  server: { port: 5173, open: true },
});
