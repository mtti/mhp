import nunjucks from 'nunjucks';
import { RenderStringFunc } from '../types/Environment';

export const renderString = (
  env: nunjucks.Environment,
): RenderStringFunc => (
  str: string,
  vars: Record<string, unknown>,
): string => env.renderString(str, vars);
