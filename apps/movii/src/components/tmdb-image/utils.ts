import { TmdbSizeToken } from '@/components/tmdb-image/types';

export const isAbsoluteUrl = (p: string) => p.startsWith('http://') || p.startsWith('https://');

export const normalizePath = (p: string) => {
  if (!p) {
    return '';
  }

  // 전체 URL이 들어오면 그대로 사용
  if (isAbsoluteUrl(p)) {
    return p;
  }

  return p.startsWith('/') ? p : `/${p}`;
};

// TMDB 이미지 크기 토큰 파싱
// e.g, 'w300' -> { axis: 'w', px: 300 }
export const parseToken = (token: string): { axis: 'w' | 'h' | 'o'; px: number } => {
  if (token === 'original') {
    return { axis: 'o', px: Number.POSITIVE_INFINITY };
  }

  const axis = token[0] as 'w' | 'h';
  const px = Number.parseInt(token.slice(1), 10);

  return {
    axis,
    px: Number.isFinite(px) ? px : Number.POSITIVE_INFINITY,
  };
};

/**
 * 렌더된 이미지 요소의 실제 크기(레이아웃 크기)를 측정합니다.
 * 이미지 요소 자체의 크기뿐만 아니라 부모 요소의 크기도 참고합니다.
 * 이는 CSS에서 width/height가 %나 vw/vh 등으로 지정된 경우를 대비하기 위함입니다.
 */
export const measureRenderedSize = (img: HTMLImageElement) => {
  const rect = img.getBoundingClientRect();
  const parentRect = img.parentElement?.getBoundingClientRect();

  const width = rect.width || parentRect?.width || 0;
  const height = rect.height || parentRect?.height || 0;

  return { width, height };
};

/**
 * dpr: CSS 픽셀 1개가 실제 디스플레이(물리) 픽셀 몇 개로 그려지는지를 나타내는 비율.
 * 이미지 선명도에 영향을 줍니다.
 */
export const withDpr = (cssPx: number) => {
  const dpr = window.devicePixelRatio || 1;
  return Math.ceil(cssPx * dpr);
};

/**
 * targetW/targetH(각각 DPR 반영된 목표 픽셀) 기준으로,
 * 후보 토큰(w/h/original) 중 "충분히 큰 것"들에서 초과 비율이 가장 작은 것을 선택합니다.
 * e.g, targetW=500, targetH=300, tokens=['w300', 'w780', 'w1280', 'original'] 일 때
 * axis = w 기준으로 보면,
 * w300: cover = 300 / 500 = 0.6 (작아서 제외)
 * w780: cover = 780 / 500 = 1.56
 * w1280: cover = 1280 / 500 = 2.56
 * original: cover = Infinity / 500 = Infinity
 * 최종 선택: w780
 */
export const pickBestToken = (
  tokens: readonly string[],
  targetW: number,
  targetH: number,
): TmdbSizeToken => {
  const candidates = tokens
    .map((token) => {
      const { axis, px } = parseToken(token);
      const target = axis === 'w' ? targetW : axis === 'h' ? targetH : Math.max(targetW, targetH);
      const cover = px / Math.max(1, target); // >= 1이면 목표 이상
      return { token, cover };
    })
    .filter((c) => c.cover >= 1);

  if (candidates.length === 0) {
    return 'original';
  }

  candidates.sort((a, b) => a.cover - b.cover);
  return candidates[0].token as TmdbSizeToken;
};
