import {
  Children,
  ComponentProps,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from './utils';

type CarouselMode = 'auto' | 'manual';

type ConfigurableCarouselProps = {
  /**
   * Slide transition mode
   * @default 'manual'
   */
  mode: CarouselMode;
  /**
   * Enable infinite loop (automatically set to true when mode is "auto")
   * @default false
   */
  loop: boolean;
  /**
   * Auto slide interval in milliseconds (only effective in auto mode)
   * @default 5000
   */
  autoInterval: number;
  /**
   * Initial slide index
   * @default 0
   */
  initialIndex: number;
  /**
   * Callback function called when slide changes (receives active slide index)
   */
  onSlideChange: (index: number | number[]) => void;
  /**
   * Number of slides visible per view (ProgressBar and Pagination unavailable when > 1)
   * @default 1
   */
  slidesPerView: number;
  /**
   * Space between slides in pixels (only effective when slidesPerView > 1)
   * @default 0
   */
  spaceBetween: number;
};

type CarouselRootProps = PropsWithChildren<Partial<ConfigurableCarouselProps>>;

type CarouselContentProps = ComponentProps<'div'> & {
  children: ReactNode;
  className?: string;
};

type CarouselState = Pick<
  ConfigurableCarouselProps,
  'mode' | 'loop' | 'autoInterval' | 'slidesPerView' | 'spaceBetween'
> & {
  /**
   * 슬라이드의 실제 인덱스 (복제 슬라이드 포함)
   */
  currentSlideIndex: number;
  /**
   * 현재 활성화된 슬라이드 인덱스 (유저가 보는 순서)
   */
  activeSlideIndex: number;
  /**
   * 전체 슬라이드 아이템 개수
   */
  totalItemLength: number;
  /**
   * 슬라이드 전환 중 여부
   */
  isTransitioning: boolean;
};

type CarouselActions = {
  /**
   * 특정 인덱스의 슬라이드로 이동
   */
  goToSlide: (index: number) => void;
  /**
   * 이전 슬라이드로 이동
   */
  goToPrev: () => void;
  /**
   * 다음 슬라이드로 이동
   */
  goToNext: () => void;
  /**
   * 슬라이드 전환이 끝났을 때 호출
   */
  handleTransitionEnd: () => void;
};

const CarouselStateContext = createContext<CarouselState | null>(null);
const CarouselActionsContext = createContext<CarouselActions | null>(null);

const useCarouselState = () => {
  const context = useContext(CarouselStateContext);
  if (!context) {
    throw new Error('Carousel components must be used within Carousel.Root');
  }
  return context;
};

const useCarouselActions = () => {
  const context = useContext(CarouselActionsContext);
  if (!context) {
    throw new Error('Carousel components must be used within Carousel.Root');
  }
  return context;
};

const CarouselRoot = ({
  mode = 'manual',
  loop = false,
  autoInterval = 5000,
  initialIndex = 0,
  onSlideChange,
  slidesPerView = 1,
  spaceBetween = 0,
  children,
  ...props
}: CarouselRootProps) => {
  // auto mode일 때는 자동으로 loop를 true로 설정
  const effectiveLoop = mode === 'auto' ? true : loop;

  const totalItemLength = useMemo(() => {
    let count = 0;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === CarouselContent) {
        const contentChild = child as ReactElement<CarouselContentProps>;
        count = Children.count(contentChild.props.children);
      }
    });

    return count;
  }, [children]);

  // loop가 활성화된 경우 복제 슬라이드 고려
  const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
    if (slidesPerView > 1) {
      // slidesPerView > 1일 때는 loop 여부와 관계없이 initialIndex 사용
      return effectiveLoop ? initialIndex + slidesPerView : initialIndex;
    } else {
      // slidesPerView === 1일 때는 기존 로직
      return effectiveLoop ? initialIndex + 1 : initialIndex;
    }
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 활성 슬라이드 인덱스 계산 (UI 표시용)
  const activeSlideIndex = useMemo(() => {
    if (!effectiveLoop || totalItemLength <= 1) {
      return currentSlideIndex;
    }

    // 복제 슬라이드를 제외한 인덱스 계산
    if (slidesPerView > 1) {
      return (currentSlideIndex - slidesPerView + totalItemLength) % totalItemLength;
    } else {
      return (currentSlideIndex - 1 + totalItemLength) % totalItemLength;
    }
  }, [currentSlideIndex, effectiveLoop, totalItemLength, slidesPerView]);

  // 현재 보이는 슬라이드들의 인덱스를 계산하는 함수
  const getVisibleSlideIndices = useCallback(
    (baseIndex: number): number | number[] => {
      if (slidesPerView === 1) {
        return baseIndex;
      }

      // slidesPerView > 1일 때는 현재 보이는 슬라이드들의 array 반환
      return Array.from({ length: slidesPerView }, (_, i) => (baseIndex + i) % totalItemLength);
    },
    [slidesPerView, totalItemLength],
  );

  // 슬라이드 이동을 위한 통합 함수
  const navigateSlides = useCallback(
    (target: number | 'next' | 'prev') => {
      if (isTransitioning) {
        return;
      }

      setIsTransitioning(true);

      // 특정 인덱스로 직접 이동하는 경우
      if (typeof target === 'number') {
        if (target < 0 || target >= totalItemLength) {
          setIsTransitioning(false);
          return;
        }

        const targetIndex = effectiveLoop && slidesPerView === 1 ? target + 1 : target;
        setCurrentSlideIndex(targetIndex);
        onSlideChange?.(getVisibleSlideIndices(target));
        return;
      }

      // next/prev button을 눌러 이동하는 경우
      const direction = target;
      const isSingleSlide = slidesPerView === 1;

      if (isSingleSlide) {
        // 단일 슬라이드: 하나의 슬라이드씩 이동
        setCurrentSlideIndex((prev) => prev + (direction === 'next' ? 1 : -1));

        let targetIndex: number;
        if (direction === 'next') {
          targetIndex = activeSlideIndex === totalItemLength - 1 ? 0 : activeSlideIndex + 1;
        } else {
          targetIndex = activeSlideIndex === 0 ? totalItemLength - 1 : activeSlideIndex - 1;
        }

        onSlideChange?.(getVisibleSlideIndices(targetIndex));
        return;
      }

      // 멀티 슬라이드: 기본적으로 slidesPerView 단위로 이동하지만, 남은 슬라이드 개수를 고려함
      // e.g, totalSlide=10, slidesPerView=3, 남은 슬라이드 1개에서 next -> 1개 슬라이드만큼만 이동
      if (effectiveLoop) {
        if (direction === 'next') {
          // 남은 슬라이드: 전체 - (현재 - 복제영역) - 한 페이지
          const remainingSlidesLength =
            totalItemLength -
            ((currentSlideIndex - slidesPerView) % totalItemLength) -
            slidesPerView;
          const actualStep =
            remainingSlidesLength > 0
              ? Math.min(slidesPerView, remainingSlidesLength)
              : slidesPerView;
          const newIndex = currentSlideIndex + actualStep;
          setCurrentSlideIndex(newIndex);

          // 실제 활성 슬라이드 인덱스 계산 (복제된 영역 고려)
          const realActiveIndex = (newIndex - slidesPerView) % totalItemLength;
          onSlideChange?.(getVisibleSlideIndices(realActiveIndex));
        }

        if (direction === 'prev') {
          const remainingSlidesLength =
            (currentSlideIndex - slidesPerView * 2 + totalItemLength) % totalItemLength;
          const actualStep =
            remainingSlidesLength > 0
              ? Math.min(slidesPerView, remainingSlidesLength)
              : slidesPerView;
          const newIndex = currentSlideIndex - actualStep;
          setCurrentSlideIndex(newIndex);

          // 실제 활성 슬라이드 인덱스 계산 (복제된 영역 고려)
          const realActiveIndex = (newIndex - slidesPerView + totalItemLength) % totalItemLength;
          onSlideChange?.(getVisibleSlideIndices(realActiveIndex));
        }
        return;
      }

      if (direction === 'next') {
        const maxIndex = totalItemLength - slidesPerView;
        if (currentSlideIndex < maxIndex) {
          const remainingSlidesLength = totalItemLength - currentSlideIndex;
          const actualStep = Math.min(slidesPerView, remainingSlidesLength - slidesPerView + 1);
          const nextIndex = Math.min(currentSlideIndex + actualStep, maxIndex);
          setCurrentSlideIndex(nextIndex);
          onSlideChange?.(getVisibleSlideIndices(nextIndex));
        }
      }

      if (direction === 'prev') {
        if (currentSlideIndex > 0) {
          const prevIndex = Math.max(currentSlideIndex - slidesPerView, 0);
          setCurrentSlideIndex(prevIndex);
          onSlideChange?.(getVisibleSlideIndices(prevIndex));
        }
      }
    },
    [
      isTransitioning,
      slidesPerView,
      activeSlideIndex,
      totalItemLength,
      onSlideChange,
      effectiveLoop,
      currentSlideIndex,
      getVisibleSlideIndices,
    ],
  );

  const goToSlide = useCallback((index: number) => navigateSlides(index), [navigateSlides]);
  const goToNext = useCallback(() => navigateSlides('next'), [navigateSlides]);
  const goToPrev = useCallback(() => navigateSlides('prev'), [navigateSlides]);

  // 유저에게는 복제 영역이 보이지 않도록, 복제 영역에 도달하면 transition 없이 원래 index로 점프
  const handleTransitionEnd = useCallback(() => {
    if (effectiveLoop && totalItemLength > 1) {
      if (slidesPerView > 1) {
        if (currentSlideIndex >= totalItemLength + slidesPerView) {
          // 끝 복제 영역에 도달하면 처음으로 점프
          setCurrentSlideIndex(slidesPerView);
        } else if (currentSlideIndex < slidesPerView) {
          // 앞 복제 영역에 도달하면 끝으로 점프
          setCurrentSlideIndex(totalItemLength);
        }
      } else {
        if (currentSlideIndex >= totalItemLength + 1) {
          setCurrentSlideIndex(1);
        } else if (currentSlideIndex <= 0) {
          setCurrentSlideIndex(totalItemLength);
        }
      }
    }
    setIsTransitioning(false);
  }, [effectiveLoop, totalItemLength, currentSlideIndex, slidesPerView]);

  const actions: CarouselActions = useMemo(
    () => ({
      goToSlide,
      goToPrev,
      goToNext,
      handleTransitionEnd,
    }),
    [goToSlide, goToPrev, goToNext, handleTransitionEnd],
  );

  const state: CarouselState = useMemo(
    () => ({
      currentSlideIndex,
      activeSlideIndex,
      totalItemLength,
      mode,
      loop: effectiveLoop,
      autoInterval,
      isTransitioning,
      slidesPerView,
      spaceBetween,
    }),
    [
      currentSlideIndex,
      activeSlideIndex,
      totalItemLength,
      mode,
      effectiveLoop,
      autoInterval,
      isTransitioning,
      slidesPerView,
      spaceBetween,
    ],
  );

  // auto mode일 때 자동 슬라이드 전환
  useEffect(() => {
    if (mode !== 'auto' || totalItemLength <= 1) {
      return;
    }

    let startTime = Date.now();
    let animationId: number;

    const checkForSlideChange = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // 지정된 간격이 지났으면 다음 슬라이드로 이동
      if (elapsed >= autoInterval) {
        setIsTransitioning(true);
        setCurrentSlideIndex((prev) => prev + 1);

        const targetIndex = activeSlideIndex === totalItemLength - 1 ? 0 : activeSlideIndex + 1;
        onSlideChange?.(getVisibleSlideIndices(targetIndex));
        startTime = now; // 타이머 리셋
      }

      animationId = requestAnimationFrame(checkForSlideChange);
    };

    animationId = requestAnimationFrame(checkForSlideChange);
    return () => cancelAnimationFrame(animationId);
  }, [
    mode,
    totalItemLength,
    autoInterval,
    onSlideChange,
    effectiveLoop,
    activeSlideIndex,
    getVisibleSlideIndices,
  ]);

  return (
    <CarouselStateContext.Provider value={state}>
      <CarouselActionsContext.Provider value={actions}>
        <div {...props} className="carousel-root">
          {children}
        </div>
      </CarouselActionsContext.Provider>
    </CarouselStateContext.Provider>
  );
};

const MultiSlidesView = ({ children, className, ...props }: CarouselContentProps) => {
  const { currentSlideIndex, loop, isTransitioning, slidesPerView, spaceBetween } =
    useCarouselState();
  const { handleTransitionEnd } = useCarouselActions();
  const totalItemLength = Children.count(children);
  const childrenArray = Children.toArray(children);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 컨테이너 너비 측정
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // loop를 위한 확장된 슬라이드 생성
  const extendedSlides =
    loop && totalItemLength > 1
      ? [
          ...childrenArray.slice(-slidesPerView), // 뒤에서 slidesPerView개 복사
          ...childrenArray, // 원본 슬라이드들
          ...childrenArray.slice(0, slidesPerView), // 앞에서 slidesPerView개 복사
        ]
      : childrenArray;

  // spaceBetween을 퍼센트로 변환
  const spaceBetweenPercent = (spaceBetween / containerWidth) * 100;

  const slideWidthPercent = (100 - spaceBetweenPercent * (slidesPerView - 1)) / slidesPerView;

  // spaceBetween 고려한 각 슬라이드의 너비
  const slideWithSpacePercent = slideWidthPercent + spaceBetweenPercent;

  const translateX = slideWithSpacePercent * currentSlideIndex;

  return (
    <div {...props} className={cn('carousel-content-multi', className)} ref={containerRef}>
      <ul
        style={{
          display: 'flex',
          transition: isTransitioning
            ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none',
          transform: `translateX(-${translateX}%)`,
          width: '100%',
          height: '100%',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, index) => {
          const isLast = index === extendedSlides.length - 1;
          return (
            <li
              key={`slide-${index}`}
              style={{
                width: `${slideWidthPercent}%`,
                flexShrink: 0,
                height: '100%',
                marginRight: !isLast && spaceBetweenPercent > 0 ? `${spaceBetweenPercent}%` : '0',
              }}
            >
              {slide}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const SingleSlideView = ({ children, className, ...props }: CarouselContentProps) => {
  const { currentSlideIndex, loop, isTransitioning } = useCarouselState();
  const { handleTransitionEnd } = useCarouselActions();
  const totalItemLength = Children.count(children);
  const childrenArray = Children.toArray(children);

  const extendedSlides =
    loop && totalItemLength > 1
      ? [childrenArray[totalItemLength - 1], ...childrenArray, childrenArray[0]]
      : childrenArray;

  const totalSlidesLength = extendedSlides.length;
  const translateX = currentSlideIndex * (100 / totalSlidesLength);

  return (
    <div {...props} className={cn('carousel-content', className)}>
      <ul
        style={{
          display: 'flex',
          transition: isTransitioning
            ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none',
          transform: `translateX(-${translateX}%)`,
          width: `${totalSlidesLength * 100}%`,
          overflow: 'hidden',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, index) => (
          <li
            key={`slide-${index}`}
            style={{
              width: `${100 / totalSlidesLength}%`,
              flexShrink: 0,
            }}
          >
            {slide}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CarouselContent = ({ children, ...props }: CarouselContentProps) => {
  const { slidesPerView } = useCarouselState();

  const View = slidesPerView > 1 ? MultiSlidesView : SingleSlideView;

  return <View {...props}>{children}</View>;
};

const CarouselPrevButton = ({
  children,
  className,
  disabled,
  ...props
}: ComponentProps<'button'>) => {
  const { activeSlideIndex, loop } = useCarouselState();
  const { goToPrev } = useCarouselActions();

  // loop가 false일 때 첫 번째에서 disabled
  // loop가 true이거나 첫 번째가 아니면 활성화
  const isDisabled = disabled || (!loop && activeSlideIndex === 0);

  return (
    <button
      type="button"
      className={cn('carousel-button', 'carousel-button-prev', className)}
      disabled={isDisabled}
      onClick={goToPrev}
      aria-label="Previous slide"
      {...props}
    >
      {children || (
        <svg
          className="carousel-button-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 40"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            d="M9.48.09a1 1 0 0 1 .44 1.3L1.99 20l7.93 18.61c.2.5 0 1.07-.44 1.3-.45.23-.99.01-1.2-.48L0 20 8.28.57c.21-.5.75-.7 1.2-.48"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

const CarouselNextButton = ({
  children,
  className,
  disabled,
  ...props
}: ComponentProps<'button'>) => {
  const { activeSlideIndex, totalItemLength, loop, slidesPerView } = useCarouselState();
  const { goToNext } = useCarouselActions();

  // loop가 false일 때 마지막에서 disabled
  // multi-slide에서는 마지막 페이지를 고려해야 함
  const maxIndex = slidesPerView > 1 ? totalItemLength - slidesPerView : totalItemLength - 1;
  const isDisabled = disabled || (!loop && activeSlideIndex >= maxIndex);

  return (
    <button
      type="button"
      className={cn('carousel-button', 'carousel-button-next', className)}
      onClick={goToNext}
      disabled={isDisabled}
      aria-label="Next slide"
      {...props}
    >
      {children || (
        <svg
          className="carousel-button-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 40"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            d="M.52.09a1 1 0 0 0-.44 1.3L8.02 20 .08 38.62c-.2.49 0 1.07.44 1.29.46.23.99.01 1.2-.48L10 20 1.72.57C1.5.07.98-.13.52.09"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

type CarouselPaginationProps = {
  containerClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  renderDot?: (index: number, isActive: boolean) => ReactNode;
};

const CarouselPagination = ({
  containerClassName,
  dotClassName,
  activeDotClassName,
  renderDot,
}: CarouselPaginationProps) => {
  const { activeSlideIndex, totalItemLength, slidesPerView } = useCarouselState();
  const { goToSlide } = useCarouselActions();

  if (slidesPerView > 1) {
    throw new Error('Pagination cannot be used when slidesPerView > 1');
  }

  return (
    <div className={cn('carousel-pagination', containerClassName)}>
      {Array.from({ length: totalItemLength }, (_, index) => {
        const isActive = index === activeSlideIndex;
        const ariaLabel = `Go to slide ${index + 1}`;

        if (renderDot) {
          return (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={ariaLabel}
            >
              {renderDot(index, isActive)}
            </button>
          );
        }

        return (
          <button
            key={index}
            type="button"
            className={cn(
              'carousel-pagination-dot',
              isActive && 'carousel-pagination-dot-active',
              isActive ? activeDotClassName : dotClassName,
            )}
            onClick={() => goToSlide(index)}
            aria-label={ariaLabel}
          />
        );
      })}
    </div>
  );
};

type CarouselProgressBarProps = {
  className?: string;
  fillClassName?: string;
};

const CarouselProgressBar = ({ className, fillClassName }: CarouselProgressBarProps) => {
  const { mode, isTransitioning, autoInterval, totalItemLength, activeSlideIndex, slidesPerView } =
    useCarouselState();

  if (slidesPerView > 1) {
    throw new Error('ProgressBar cannot be used when slidesPerView > 1');
  }
  const progressRef = useRef<HTMLDivElement>(null);

  // auto mode에서 progress 계산
  useEffect(() => {
    if (mode !== 'auto' || totalItemLength <= 1 || !progressRef.current) {
      return;
    }

    const startTime = Date.now();
    let animationId: number;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min(elapsed / autoInterval, 1);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${newProgress})`;
      }

      animationId = requestAnimationFrame(updateProgress);
    };

    animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [mode, autoInterval, totalItemLength, activeSlideIndex]);

  // manual mode에서 progress 계산
  useEffect(() => {
    if (mode === 'manual' && progressRef.current) {
      const newProgress = totalItemLength > 0 ? (activeSlideIndex + 1) / totalItemLength : 0;
      progressRef.current.style.transform = `scaleX(${newProgress})`;
    }
  }, [mode, totalItemLength, activeSlideIndex]);

  return (
    <div className={cn('carousel-progress-bar', className)}>
      <div
        ref={progressRef}
        className={cn('carousel-progress-bar-fill', fillClassName)}
        style={{
          width: '100%',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          transition:
            mode === 'manual' && isTransitioning
              ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'none',
        }}
      />
    </div>
  );
};

export const Carousel = {
  Root: CarouselRoot,
  Content: CarouselContent,
  PrevButton: CarouselPrevButton,
  NextButton: CarouselNextButton,
  Pagination: CarouselPagination,
  ProgressBar: CarouselProgressBar,
};

export type {
  CarouselContentProps,
  CarouselPaginationProps,
  CarouselProgressBarProps,
  CarouselRootProps,
};

export { useCarouselActions, useCarouselState };
