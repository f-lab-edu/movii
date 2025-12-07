import { defineConfig, mergeRsbuildConfig, loadEnv } from '@rsbuild/core';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

import commonConfig from './rsbuild.common';

const prodConfig = defineConfig({
  mode: 'production',
  output: {
    /**
     * source-map 설정
     * prod: hidden-source-map - 별도의 소스맵 파일 생성, 에러 스택트레이스에 소스맵 URL 포함하지 않음(보안상 유리)
     */
    sourceMap: {
      js: 'hidden-source-map',
    },
  },
  plugins: [pluginTypeCheck()],
  tools: {
    rspack: {
      plugins: [process.env.RSDOCTOR === 'true' && new RsdoctorRspackPlugin()],
    },
  },
  dev: {
    lazyCompilation: false,
  },
  source: {
    define: loadEnv().publicVars,
    // 아래 패키지들은 .browserslistrc에 정의된 브라우저보다 지원 사양이 높으므로 트랜스파일에 추가
    include: [
      /node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
      /node_modules[\\/]@tanstack[\\/]query-core[\\/]/,
    ],
  },
  performance: {
    chunkSplit: {
      strategy: 'custom',
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // node_modules 폴더의 모듈을 대상으로 합니다.
            name: 'vendors', // 분리된 청크의 이름을 지정합니다.
            chunks: 'all',
          },
        },
      },
    },
  },
});

export default mergeRsbuildConfig(commonConfig, prodConfig);
