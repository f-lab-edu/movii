import { defineConfig, mergeConfig } from 'vite';

import commonConfig from './vite.common.mjs';

export default defineConfig(({ isSsrBuild }) =>
  mergeConfig(
    commonConfig({ isSsrBuild }),
    defineConfig({
      mode: 'development',
      server: {
        port: 3000,
        open: true,
        strictPort: true,
      },
      preview: {
        port: 4173,
        strictPort: true,
      },
      build: {
        sourcemap: true,
      },
    }),
  ),
);
