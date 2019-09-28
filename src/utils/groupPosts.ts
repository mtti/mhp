import { Post } from '../Post';
import { getUniqueAttributeValues } from './getUniqueAttributeValues';

/**
 * Group posts by an attribute.
 *
 * @param posts
 * @param key
 * @returns An array of value-Post pairs.
 */
export function groupPosts(posts: Post[], key: string): [string, Post[]][] {
  return getUniqueAttributeValues(posts, key)
    .filter((value) => typeof value === 'string')
    .map((value) => value as string)
    .map((value): [string, Post[]] => [
      value,
      posts.filter((post) => post.attributes[key] === value),
    ]);
}
