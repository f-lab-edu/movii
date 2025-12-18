/**
 * Object.entries의 반환 타입을 key, value 쌍으로 튜플 배열 형태로 변환합니다.
 * (typed version of Object.entries)
 * @param obj
 * @returns
 */
export const typedEntries = <T extends Record<string, unknown>>(
  obj: T,
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};
