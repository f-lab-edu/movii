# Movii Web (`@movii/web`)

간소화된 왓챠 클론코딩 프로젝트입니다.

- Next.js(pages router) 기반의 웹 앱입니다.

## Requirements

- Node.js: `>= 22.20`
- pnpm: `>= 10.20`

모노레포 루트경로에서 아래 명령어를 입력합니다.

```bash
pnpm -v
node -v
```

## Environment Variables

TMDB API 호출에 아래 값이 필요합니다.

- `NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN`

1. [TMDB](https://developer.themoviedb.org/reference/getting-started)에서 API Key를 발급받습니다.
2. 이후 `apps/movii/.env.development`, `apps/movii/.env.production` 파일을 생성합니다.
3. 각 파일 내에 NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN="<발급받은 API Key>"를 삽입합니다.

## Local Development

모노레포 루트 경로에서 아래 명령어를 입력합니다.

```bash
pnpm web dev
```

- 기본 포트: `http://localhost:3000`

## Production Build & Run

모노레포 루트 경로에서 아래 명령어를 입력합니다.

```bash
pnpm web build
pnpm web start
```

프로덕션 빌드 산출물은 `out/`에 생성됩니다.

### `serve` (static server)

이 프로젝트는 `next.config.ts`에서 `output: 'export'`를 사용합니다.
즉, `pnpm web start`는 Next 서버를 띄우는 것이 아니라 **정적 export 산출물(`out/`)을 서빙**합니다.

- 사용 패키지: `serve`
- 실행 스크립트: `serve -c ../serve.json out`

#### 왜 `serve.json`이 필요한가?

정적 서빙 환경에서는 `/contents/123` 같은 **dynamic route를 새로고침**하면,
서버 입장에서는 해당 경로의 정적 파일을 찾지 못해 404가 날 수 있습니다.

이를 로컬에서 완화하기 위해 [serve.json](serve.json)에 `rewrites` 규칙을 두고,
요청 경로(`/contents/:id`)를 export 결과물의 placeholder 경로(`/contents/[id]...`)로 매핑합니다.

#### 포트를 바꾸고 싶다면

`serve`는 옵션이 **경로 인자(out)보다 앞**에 와야 합니다.
예를 들어 3010 포트로 띄우려면 아래처럼 실행합니다.

```bash
pnpm -C apps/movii exec serve -l 3010 -c ../serve.json out
```

## Deploy

S3 + Cloudfront 기반 정적 배포입니다.
Dynamic routes의 경우 CloudFront Functions에서 uri를 rewrite하여 핸들링합니다.

### 필요한 GitHub Secrets

- `TMDB_API_ACCESS_TOKEN`

워크플로우 내부에서는 이를 `NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN` 환경변수로 매핑하여 빌드에 사용합니다.
