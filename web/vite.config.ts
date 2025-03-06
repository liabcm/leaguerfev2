import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // This should match Azure's output_location
  },
  plugins: [react()],
});
