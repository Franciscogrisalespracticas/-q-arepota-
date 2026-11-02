import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages publica este repositorio como subruta, no en la raiz del dominio.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'github-pages' ? '/-q-arepota-/' : '/',
  server: { host: '0.0.0.0' },
}));
