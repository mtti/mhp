import { Post } from '../Post';
import { getUniqueAttributeValues } from './getUniqueAttributeValues';

export function groupPosts(posts: Post[], key: string): [string, Post[]][] {
  return getUniqueAttributeValues(posts, key)
    .filter((value) => typeof value === 'string')
    .map((value) => value as string)
    .map((value): [string, Post[]] => [
      value,
      posts.filter((post) => post.attributes[key] === value),
    ]);
}
