import { ensureStartsWith } from '@mtti/funcs';

/**
 * Replace a parameter in an URI with a different string.
 *
 * @param uriParts
 * @param key
 * @param replacement
 */
export function replaceUriParameter(
  uriParts: readonly string[],
  key: string,
  replacement: string,
): string[] {
  const prefixedKey = ensureStartsWith(key, ':');
  return uriParts.map((item) => (item === prefixedKey ? replacement : item));
}
