/**
 * Append a suffix to the last element of a URI parts array.
 *
 * @param uri
 * @param suffix
 */
export function suffixUriFilename(
  uri: readonly string[],
  suffix: string,
): readonly string[] {
  return [...uri.slice(0, -1), `${uri.slice(-1)}${suffix}`];
}
