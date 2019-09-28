import { mustStartWith } from './mustStartWith';

/**
 * Replace a parameter in an URI with a different string.
 *
 * @param uriParts
 * @param key
 * @param replacement
 */
export function replaceUriParameter(
  uriParts: string[],
  key: string,
  replacement: string,
): string[] {
  const prefixedKey = mustStartWith(key, ':');
  return uriParts.map((item) => (item === prefixedKey ? replacement : item));
}
