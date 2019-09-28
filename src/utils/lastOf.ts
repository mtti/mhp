/**
 * Returns the last element of an array or throws an error if the array is
 * empty.
 *
 * @param arr An array
 */
export function lastOf<T>(arr: readonly T[]): T {
  if (arr.length === 0) {
    throw new Error('Unexpected empty array');
  }
  return arr[arr.length - 1];
}
