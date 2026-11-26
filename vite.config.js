import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, las llamadas a /api se reenvían a la API de Node.
    // Así el navegador ve un solo origen y no hace falta configurar CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
