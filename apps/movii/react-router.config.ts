import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  buildDirectory: 'dist',
  appDirectory: 'app',
  basename: '/',
  prerender: true,
} satisfies Config;
