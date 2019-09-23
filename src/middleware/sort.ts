import { Post } from '../Post';
import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

/**
 * Create a middleware which sorts posts according to a sorting function.
 *
 * @param sorter
 */
export const sort = (sorter: (a: Post, b: Post) => number): Middleware => (
  async (context: BuildContext): Promise<BuildContext> => ({
    ...context,
    posts: [...context.posts].sort(sorter),
  })
);
