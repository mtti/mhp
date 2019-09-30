import { fromEntries } from '@mtti/funcs';

/**
 * Parse a list of key-value pairs into an object.
 *
 * @param pairs
 */
export function parsePairs(
  pairs: string[],
  separator: string = '=',
): Record<string, string> {
  return fromEntries<string, string>(pairs
    .map((pair) => pair.split(separator, 2))
    .map(([key, value]) => [key, value]));
}
