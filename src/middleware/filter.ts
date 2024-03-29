import { Post } from '../Post';
import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';

/**
 * Filter posts in the current context according to a filter function.
 *
 * @param filterFunc
 */
export const filter = (filterFunc: (post: Post) => boolean): Middleware => (
  async (_: Environment, context: BuildContext): Promise<BuildContext> => ({
    ...context,
    posts: context.posts.filter(filterFunc),
  })
);
