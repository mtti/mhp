/**
 * Flatten a simple array of arrays.
 *
 * @param arr
 */
export function flatten<T>(arr: T[][]): T[] {
  const reducer = (previousValue: T[], currentValue: T|T[]): T[] => {
    if (Array.isArray(currentValue)) {
      return currentValue.reduce(reducer, previousValue);
    }
    return [...previousValue, currentValue];
  };

  return arr.reduce(reducer, []);
}
