import { lastOf } from '@mtti/funcs';
import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { RenderFunc } from '../types/Environment';
import { cleanUri } from '../utils/cleanUri';
import { joinUri } from '../utils/joinUri';
import { MenuItem } from '../types/MenuItem';
import { RenderContext, RenderContextKey } from '../types/RenderContext';
import { resolveActivePath } from '../utils/resolveActivePath';
import { arraysEqual } from '../utils/arraysEqual';

export const render = (
  env: nunjucks.Environment,
  menu: readonly MenuItem[],
): RenderFunc => (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: string,
): string => {
  let activePath = resolveActivePath(menu, context.uri);

  // Add current page to the active path if it's not already there
  const isNotRoot = context.uri.length > 0;
  const notAlreadyInActivePath = (activePath.length === 0
    || !arraysEqual(lastOf(activePath).uri, cleanUri(context.uri)));

  if (isNotRoot && notAlreadyInActivePath) {
    const slug = lastOf(context.uri);
    activePath = [
      ...activePath,
      {
        uri: context.uri,
        slug,
        title: vars.title as string || slug,
        children: [],
      },
    ];
  }

  const renderContext: RenderContext = {
    activePath,
  };

  return env.render(
    template,
    {
      ...context.vars,
      ...vars,
      front: context.uri.length === 0,
      uri: joinUri(cleanUri(context.uri)),
      menu,
      breadcrumbs: renderContext.activePath,
      [RenderContextKey]: renderContext,
    },
  );
};
