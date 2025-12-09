import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, mergeConfig } from 'vite';

import commonConfig from './vite.common.mjs';

export function createProdConfig() {
  /**
   * @type {import('vite').UserConfig}
   */
  const prodConfig = {
    mode: 'production',
    plugins: [],
    build: {
      outDir: 'dist',
      target: 'es2017',
      optimizeDeps: {
        include: ['@tanstack/react-query', '@tanstack/query-core'],
      },
      build: {
        commonjsOptions: {
          include: [/node_modules\/@tanstack\/.*/],
        },
      },
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
  };

  if (process.env.ANALYZE === 'true') {
    prodConfig.plugins.push(
      visualizer({
        filename: 'dist/analyze.html',
        template: 'treemap',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    );
  }

  const merged = mergeConfig(commonConfig, prodConfig);

  return defineConfig(merged);
}

export default defineConfig(() => createProdConfig());
