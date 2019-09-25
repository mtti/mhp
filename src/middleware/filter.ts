import { Post } from '../Post';
import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

/**
 * Create a middleware which filters posts.
 *
 * @param filterFunc
 */
export const filter = (filterFunc: (post: Post) => boolean): Middleware => (
  async (_, context: BuildContext): Promise<BuildContext> => ({
    ...context,
    posts: context.posts.filter(filterFunc),
  })
);
