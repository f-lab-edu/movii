import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';

import commonConfig from './rsbuild.common';

const devConfig = defineConfig({
  mode: 'development',
  server: {
    port: 3000, // localhost:3000에서 실행
    open: true, // 서버 실행 시 브라우저 자동 열기
  },
});

export default mergeRsbuildConfig(commonConfig, devConfig);
