import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { RenderFunc } from '../types/Environment';

export const render = (
  env: nunjucks.Environment,
): RenderFunc => (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: string,
): string => env.render(template, { ...context.globals, ...vars });
