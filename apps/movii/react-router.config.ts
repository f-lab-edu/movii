import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  buildDirectory: 'dist',
  appDirectory: 'src',
  basename: '/',
} satisfies Config;
