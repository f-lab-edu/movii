import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './dist/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000');

const app = express();

app.use(compression());
app.disable('x-powered-by');

if (DEVELOPMENT) {
  console.log('Starting development server');
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      configFile: './vite.dev.mjs',
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts');
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else {
  console.log('Starting production server');
  // css, js, webp 파일 등 정적 자산들은 1년 캐시
  app.use('/assets', express.static('dist/client/assets', { immutable: true, maxAge: '1y' }));
  // HTTP 요청/응답 로그를 남기는 미들웨어. 정적 자산 요청은 로그에서 제외. (로그 노이즈 감소 + 성능 이점)
  app.use(morgan('tiny'));
  app.use(
    express.static('dist/client', {
      // favicon, manifest, robots.txt 등 굳이 매 요청마다 받을 필요 없는 파일들
      maxAge: '1h',
      setHeaders: (res, path) => {
        // dist/client 안의 모든 HTML은 캐시 금지
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          // HTTP/1.0 구형 프록시/환경 대비
          res.setHeader('Pragma', 'no-cache');
          // HTTP/1.1에서는 Cache-Control 헤더가 우선하지만, HTTP/1.0/구형 캐시에서는 Expires를 참고
          res.setHeader('Expires', '0');
        }
      },
    }),
  );
  app.use(await import(BUILD_PATH).then((mod) => mod.app));

  app.listen(PORT, () => {
    console.log(`Prod server started on port ${PORT}`);
  });
}
