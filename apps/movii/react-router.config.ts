import type { Config } from '@react-router/dev/config';

export default {
  ssr: false,
  buildDirectory: 'dist',
  appDirectory: 'src',
  basename: '/',
} satisfies Config;
