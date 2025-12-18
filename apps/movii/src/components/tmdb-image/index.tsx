import { useEffect, useMemo, useRef, useState } from 'react';

import { TMDB_BASE, TMDB_IMAGE_SIZES } from '@/components/tmdb-image/constants';
import { TmdbImageProps, TmdbSizeToken } from '@/components/tmdb-image/types';
import {
  isAbsoluteUrl,
  measureRenderedSize,
  normalizePath,
  pickBestToken,
  withDpr,
} from '@/components/tmdb-image/utils';

const TmdbImage = ({
  kind,
  path,
  alt,
  width,
  height,
  priority = false,
  style,
  ...props
}: TmdbImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  // SSR/초기 렌더: props 기반(=dpr 1 가정)으로 1차 선택
  const initialToken = useMemo(
    () => pickBestToken(TMDB_IMAGE_SIZES[kind], width, height),
    [kind, width, height],
  );

  const [token, setToken] = useState<TmdbSizeToken>(initialToken);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return;
    }

    // ResizeObserver가 없어도 1회 측정만 시도
    const hasRO = typeof ResizeObserver !== 'undefined';
    let ro: ResizeObserver | null = null;

    let done = false;
    let raf = 0;
    const computeOnce = () => {
      if (done) {
        return;
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { width, height } = measureRenderedSize(img);
        // 레이아웃 아직 0이면 다음 콜까지 대기
        if (!width || !height) {
          return;
        }

        const targetW = withDpr(width);
        const targetH = withDpr(height);

        const next = pickBestToken(TMDB_IMAGE_SIZES[kind], targetW, targetH);
        setToken((prev) => (prev === next ? prev : next));

        done = true;
        ro?.disconnect(); // 이후 리사이즈로 재요청 없음
      });
    };

    if (hasRO) {
      ro = new ResizeObserver(computeOnce);
      ro.observe(img);
    }

    computeOnce();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [kind]);

  const normalized = normalizePath(path);

  // path가 전체 URL이면 TMDB 규칙을 적용하지 않고 그대로 사용
  const src = isAbsoluteUrl(normalized) ? normalized : `${TMDB_BASE}${token}${normalized}`;

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      // 언제 로드할지 (트리거/시점)
      loading={priority ? 'eager' : 'lazy'}
      // 어느 정도로 우선순위를 높게 받을지 (네트워크 우선순위 힌트)
      fetchPriority={priority ? 'high' : 'auto'}
      // 이미지를 다운로드한 뒤 화면에 그리기 전에 하는 디코딩(압축 해제) 작업을 브라우저가 언제 할지를 정하는 힌트
      // decoding="async": 디코딩을 가능하면 비동기로 처리해서, 디코딩 때문에 메인 스레드가 막히는 걸 줄이려는 힌트.
      decoding="async"
      style={{
        aspectRatio: `${width} / ${height}`,
        display: 'block',
        ...style,
      }}
      {...props}
    />
  );
};

export default TmdbImage;
