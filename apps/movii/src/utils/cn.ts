import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 주어진 입력들을 병합하여 하나의 className 문자열을 반환합니다.
 * - `clsx`는 다양한 형태의 입력(문자열, 배열, 객체 등)을 처리하며, falsy 값(false, null, undefined, 0, NaN, '')을 무시합니다.
 * - `twMerge`는 유틸리티 클래스들 사이에 발생할 수 있는 충돌을 해결합니다. 예를 들어, 같은 스타일을 지정하는 서로 다른 클래스가 있다면 twMerge는 뒤에 오는 클래스로 덮어쓰는 등의 처리를 합니다.
 */
export const cn = (...classNames: ClassValue[]) => twMerge(clsx(classNames));
