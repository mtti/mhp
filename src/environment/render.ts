import { lastOf } from '@mtti/funcs';
import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { RenderFunc } from '../types/Environment';
import { cleanUri } from '../utils/cleanUri';
import { splitUri } from '../utils/splitUri';
import { joinUri } from '../utils/joinUri';
import { MenuItem } from '../types/MenuItem';
import { RenderContext, RenderContextKey } from '../types/RenderContext';
import { resolveActivePath } from '../utils/resolveActivePath';
import { arraysEqual } from '../utils/arraysEqual';
import { TemplateSource } from '../types/TemplateSource';
import { getSubMenu } from '../utils/getSubMenu';
import { expectString } from '../utils/expectString';
import { stripActivePath } from '../utils/stripActivePath';

export const render = (
  env: nunjucks.Environment,
  menu: readonly MenuItem[],
): RenderFunc => (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: TemplateSource,
): string => {
  const renderVars = { ...context.vars, ...vars };

  // Allow setting a custom menu root with the menuRoot variable
  const frontUri: string[] = renderVars.menuRoot ?
    splitUri(expectString(renderVars.menuRoot)) : [];
  const menuRoot = frontUri.length > 0 ? getSubMenu(frontUri, menu) : menu;

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
        attributes: {},
      },
    ];
  }

  const renderContext: RenderContext = {
    activePath,
  };

  const frontUriStr = joinUri(frontUri);
  const currentUri = joinUri(cleanUri(context.uri));

  const finalVars = {
    ...renderVars,
    front: frontUriStr === currentUri,
    uri: currentUri,
    menu: menuRoot,
    frontUri: frontUriStr,
    breadcrumbs: stripActivePath(frontUri, renderContext.activePath),
    [RenderContextKey]: renderContext,
  };

  if (template.name) {
    return env.render(template.name, finalVars);
  }

  if (template.content) {
    return env.renderString(template.content, finalVars);
  }

  throw new Error('Either template name or content is required');
};
