import { toArray } from '@mtti/funcs';
import { Post } from '../Post';

/**
 * Get all unique values of an attribute from a set of posts. When the value
 * is an array, every array item is considered a separate value. Number values
 * are converted to base 10 strings and other non-number, non-string values are
 * ignored.
 *
 * @param posts
 * @param key
 */
export function getUniqueAttributeValues(
  posts: readonly Post[],
  key: string,
): unknown[] {
  const reducer = (previous: string[], current: unknown[]): string[] => {
    const strings = current
      .map((value) => (typeof value === 'number' ? value.toString(10) : value))
      .filter((value) => typeof value === 'string') as string[];
    return [...previous, ...strings];
  };

  const stringValues = posts
    .map((post) => post.attributes[key])
    .filter((value) => value)
    .map((value) => toArray(value))
    .reduce(reducer, [] as string[]);

  return Array.from(new Set(stringValues).values());
}
