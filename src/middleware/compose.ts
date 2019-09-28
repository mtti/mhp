import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';

/**
 * Combine several middleware into one.
 *
 * @param middleware
 */
export const compose = (...middleware: Middleware[]): Middleware => (
  async (env: Environment, context: BuildContext): Promise<BuildContext> => {
    let ctx = context;
    for (const m of middleware) {
      // eslint-disable-next-line no-await-in-loop
      ctx = await m(env, ctx);
    }
    return ctx;
  }
);
