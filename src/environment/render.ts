import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { RenderFunc } from '../types/Environment';
import { cleanUri } from '../utils/cleanUri';
import { joinUri } from '../utils/joinUri';

export const render = (
  env: nunjucks.Environment,
): RenderFunc => (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: string,
): string => env.render(
  template,
  {
    ...context.vars,
    ...vars,
    uri: joinUri(cleanUri(context.uri)),
  },
);
