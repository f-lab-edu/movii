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

프로덕션 빌드 산출물은 Next.js 기본 디렉토리인 `.next/`에 생성됩니다.

## Deploy (현재 임시 비활성화)

**EC2 + PM2 + Nginx** 구조로 배포합니다. 배포 자동화는 GitHub Actions 워크플로우로 수행합니다.
S3 + Cloudfront + Lambda@Edge 기반으로 대체될 예정입니다.

### EC2 배포 (Deprecated)

워크플로우: [.github/workflows/deploy-ec2.yml](../../.github/workflows/deploy-ec2.deprecated.yml)

- 트리거
  - `main` 브랜치에 push + 변경 경로가 `apps/movii/**`인 경우 자동 실행
  - 또는 Actions 탭에서 수동 실행(`workflow_dispatch`)
- 실행 환경
  - `runs-on: self-hosted` (EC2에 설치된 self-hosted runner에서 실행)
  - 서버에 `node`, `pnpm`, `pm2`가 설치되어 있어야 합니다.
- 주요 동작
  1.  EC2의 `~/apps/movii` 디렉토리로 이동
  2.  `origin/main`으로 강제 동기화 (`git reset --hard`, `git clean -fd`)
  3.  `pnpm install --frozen-lockfile`
  4.  `pnpm --filter @movii/web build`
  5.  PM2 프로세스 재생성 (Next.js `next start` 실행)
      - `pm2 delete movii || true`
      - `cd apps/movii && PORT=3000 NODE_ENV=production pm2 start pnpm --name movii -- start`
      - `pm2 save`
  6.  헬스 체크
      - `http://127.0.0.1:3000` 응답 확인
      - Nginx HTTPS 서빙 확인: `https://www.movii.shop/`
      - 평상시에는 EC2의 인바운드 룰을 My IP만으로 제한해두기 때문에 위 도메인은 접근이 안될 수 있습니다.

### 필요한 GitHub Secrets

- `TMDB_API_ACCESS_TOKEN`

워크플로우 내부에서는 이를 `NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN` 환경변수로 매핑하여 빌드에 사용합니다.
