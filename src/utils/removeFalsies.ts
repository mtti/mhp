export type Falsy = false | 0 | '' | null | undefined;

/**
 * Return a copy of an array with falsy values removed.
 *
 * @param arr
 */
export function removeFalsies<T>(arr: Array<T | Falsy>): T[] {
  const reducer = (acc: T[], current: T | Falsy): T[] => (
    current ? [...acc, current] : acc
  );
  return arr.reduce(reducer, []);
}
