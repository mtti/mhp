import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

/**
 * Create a middleware to set global template variables.
 *
 * @param values A dictionary of values to set.
 */
export const vars = (values: Record<string, unknown>): Middleware => (
  async (_, context: BuildContext): Promise<BuildContext> => ({
    ...context,
    vars: { ...context.vars, ...values },
  })
);
