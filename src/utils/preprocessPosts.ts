import { Post } from '../Post';
import { PreprocessorFn } from '../types/PreprocessorFn';

/**
 * Run preprocessor functions on an array of posts.
 *
 * @param posts
 * @param preprocessors
 */
export async function preprocessPosts(
  posts: readonly Post[],
  preprocessors: readonly PreprocessorFn[],
): Promise<Post[]> {
  const result: Post[] = [];

  for (const original of posts) {
    let post = original;
    for (const fn of preprocessors) {
      // eslint-disable-next-line no-await-in-loop
      post = await fn(post);
    }
    result.push(post);
  }

  return result;
}
