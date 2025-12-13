import { camel, snake } from 'radash';

/**
 * 객체의 key를 변환하는 재귀 유틸
 * 숫자가 포함된 key는 변환하지 않음 (예: 'iso_639_1', 'en_1234' 등)
 */
function mapKeysDeep<T>(obj: T, keyMapper: (key: string) => string): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeysDeep(item, keyMapper)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const mappedKey = /\d/.test(key) ? key : keyMapper(key);
        (acc as Record<string, unknown>)[mappedKey] = mapKeysDeep(value, keyMapper);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }
  return obj;
}

/**
 * snake_case → camelCase
 */
export const convertKeysToCamelCase = <T>(obj: T): T => mapKeysDeep(obj, camel);

/**
 * camelCase → snake_case
 */
export const convertKeysToSnakeCase = <T>(obj: T): T => mapKeysDeep(obj, snake);
