import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

/**
 * Create a middleware to set global template variables.
 *
 * @param values A dictionary of values to set.
 */
export const setGlobals = (values: Record<string, unknown>): Middleware => (
  async (context: BuildContext): Promise<BuildContext> => ({
    ...context,
    globals: { ...context.globals, ...values },
  })
);
