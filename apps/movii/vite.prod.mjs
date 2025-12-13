import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, mergeConfig } from 'vite';

import commonConfig from './vite.common.mjs';

export default defineConfig(({ isSsrBuild }) =>
  mergeConfig(
    commonConfig({ isSsrBuild }),
    defineConfig({
      mode: 'production',
      plugins: [
        process.env.ANALYZE === 'true' &&
          visualizer({
            filename: 'dist/analyze.html',
            template: 'treemap',
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
      ].filter(Boolean),
      build: {
        outDir: 'dist',
        target: 'es2017',
        emptyOutDir: true,
        sourcemap: false,
        cssCodeSplit: true,
        reportCompressedSize: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
          },
        },
      },
    }),
  ),
);
