import baseConfig from '@movii/eslint-config';
import pluginTanstackQuery from '@tanstack/eslint-plugin-query';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

// Remove specific plugins from configs
const stripPlugins = (configs, pluginNames) =>
  configs.map((config) => {
    if (!config || typeof config !== 'object') {
      return config;
    }
    if (!('plugins' in config) || !config.plugins) {
      return config;
    }

    const nextPlugins = { ...config.plugins };
    for (const pluginName of pluginNames) {
      delete nextPlugins[pluginName];
    }

    // Keep the key only if something remains.
    if (Object.keys(nextPlugins).length === 0) {
      const nextConfig = { ...config };
      delete nextConfig.plugins;
      return nextConfig;
    }

    return { ...config, plugins: nextPlugins };
  });

// packages/eslint-config에 정의된 import plugin이
// eslint-config-next의 import 플러그인과 충돌을 일으켜 nextVitals에서 import 제거
const nextVitalsWithoutImport = stripPlugins(nextVitals, ['import']);

export default defineConfig([
  ...pluginTanstackQuery.configs['flat/recommended'],
  ...baseConfig,
  ...nextVitalsWithoutImport,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);
