import { defineConfig, mergeConfig } from 'vite';

import commonConfig from './vite.common.mjs';

export function createDevConfig() {
  /**
   * @type {import('vite').UserConfig}
   */
  const devConfig = {
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
  };

  const merged = mergeConfig(commonConfig, devConfig);

  return defineConfig(merged);
}

export default defineConfig(() => createDevConfig());
