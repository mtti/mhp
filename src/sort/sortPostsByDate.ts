import { Post } from '../Post';

export function sortPostsByDate(a: Post, b: Post): number {
  return b.publishedAt.diff(a.publishedAt).milliseconds;
}
