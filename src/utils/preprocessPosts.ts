import { Post } from '../Post';
import { Plugin } from '../types/BuildOptions';

/**
 * Run preprocessor functions on an array of posts.
 *
 * @param posts
 * @param preprocessors
 */
export async function preprocessPosts(
  posts: readonly Post[],
  plugins: readonly Plugin[],
): Promise<Post[]> {
  const result: Post[] = [];

  for (const original of posts) {
    let post = original;
    for (const plugin of plugins) {
      if (!plugin.onPreprocessPost) continue;
      post = await plugin.onPreprocessPost(post);
    }
    result.push(post);
  }

  return result;
}
