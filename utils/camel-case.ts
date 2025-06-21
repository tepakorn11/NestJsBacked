import { camelCase } from 'lodash';

export function toCamelCase<T = any>(input: Record<string, any>[]): T[] {
  return input.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [camelCase(key), value]),
    ),
  ) as T[];
}
