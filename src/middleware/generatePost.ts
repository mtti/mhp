import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';
import { joinUri } from '../utils/joinUri';

/**
 * Create a middleware for generating a post page.
 */
export const generatePost = (): Middleware => (
  async (context: BuildContext): Promise<BuildContext> => {
    if (context.posts.length !== 1) {
      throw new Error(`Expected exactly 1 post, got ${context.posts.length}`);
    }

    console.log(`Would generate: ${joinUri(context.uri)}`);
    return context;
  }
);
