/**
 * Check for shallow array equality, comparing each element with `===`.
 *
 * @param a
 * @param b
 */
export function arraysEqual(
  a: readonly unknown[],
  b: readonly unknown[],
): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error('Expected two arrays');
  }

  if (a.length !== b.length) {
    return false;
  }

  if (a.some((value, index) => value !== b[index])) {
    return false;
  }

  return true;
}
