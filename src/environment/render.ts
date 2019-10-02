import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { RenderFunc } from '../types/Environment';
import { cleanUri } from '../utils/cleanUri';
import { joinUri } from '../utils/joinUri';
import { Breadcrumb } from '../types/Breadcrumb';
import { RenderContext, RenderContextKey } from '../types/RenderContext';
import { resolveActivePath } from '../utils/resolveActivePath';

export const render = (
  env: nunjucks.Environment,
  breadcrumbs: readonly Breadcrumb[],
): RenderFunc => (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: string,
): string => {
  const renderContext: RenderContext = {
    activePath: resolveActivePath(breadcrumbs, context.uri),
  };

  return env.render(
    template,
    {
      ...context.vars,
      ...vars,
      front: context.uri.length === 0,
      uri: joinUri(cleanUri(context.uri)),
      breadcrumbs: renderContext.activePath,
      [RenderContextKey]: renderContext,
    },
  );
};
