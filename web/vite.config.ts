import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // This should match Azure's output_location
  },
  plugins: [react()],
  server: {
    allowedHosts: [
      '6e43-2607-fb90-b5a4-44ff-3cbb-f6f8-74f1-b8e.ngrok-free.app', // Add your ngrok host here
    ],
  },
});
