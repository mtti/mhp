import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';

/**
 * Set global template variables.
 *
 * @param values A dictionary of values to set.
 */
export const vars = (values: Record<string, unknown>): Middleware => (
  async (_: Environment, context: BuildContext): Promise<BuildContext> => ({
    ...context,
    vars: { ...context.vars, ...values },
  })
);
