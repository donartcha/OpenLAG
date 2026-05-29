import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const packageRoot = __dirname;
const projectRoot = process.env.OPENLAG_PROJECT_ROOT
  ? path.resolve(process.env.OPENLAG_PROJECT_ROOT)
  : packageRoot;
const projectPublicDir = process.env.OPENLAG_PROJECT_ROOT ? path.join(projectRoot, 'public') : false;

export default defineConfig({
  root: packageRoot,
  publicDir: projectPublicDir,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': packageRoot,
    },
  },
  build: {
    outDir: path.join(projectRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('cytoscape')) return 'vendor-cytoscape';
          if (id.includes('@xyflow') || id.includes('dagre')) return 'vendor-flow';
          if (id.includes('react-markdown') || id.includes('marked') || id.includes('katex')) return 'vendor-docs';
          if (id.includes('react') || id.includes('react-dom') || id.includes('zustand')) return 'vendor-ui';
          if (id.includes('lucide-react')) return 'vendor-icons';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
