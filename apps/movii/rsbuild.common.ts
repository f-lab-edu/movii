import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  output: {
    assetPrefix: '/',
  },
  html: {
    template: './public/index.html',
  },
  plugins: [pluginReact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/features': path.resolve(__dirname, 'src/features'),
    },
  },
});
