import { Post } from '../Post';

/**
 * Get all unique values of an attribute from a set of posts.
 *
 * @param posts
 * @param key
 */
export function getUniqueAttributeValues(
  posts: readonly Post[],
  key: string,
): unknown[] {
  const values = new Set();

  for (const post of posts) {
    if (post.attributes[key] !== undefined) {
      values.add(post.attributes[key]);
    }
  }

  return Array.from(values.values());
}
