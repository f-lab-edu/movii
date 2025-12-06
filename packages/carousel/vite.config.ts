import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.stories.tsx'],
      rollupTypes: true, // 단일 .d.ts 파일로 번들링
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') {
          return 'index.esm.js';
        }
        if (format === 'cjs') {
          return 'index.cjs';
        }
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      // 번들에 포함하지 않을 의존성 (사용자가 설치해야 함)
      external: ['react'],
      output: {
        // CSS 파일을 별도로 추출
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names[0] === 'style.css') {
            return 'carousel.css';
          }
          return assetInfo.names?.[0] || 'asset';
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
    cssCodeSplit: false, // CSS를 하나의 파일로 추출
  },
});
