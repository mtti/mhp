import { lastOf } from '@mtti/funcs';
import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { Plugin } from '../types/BuildOptions';
import { RenderFunc } from '../types/Environment';
import { RenderOptions } from '../types/RenderOptions';
import { cleanUri } from '../utils/cleanUri';
import { splitUri } from '../utils/splitUri';
import { joinUri } from '../utils/joinUri';
import { MenuItem } from '../types/MenuItem';
import { RenderContext } from '../types/RenderContext';
import { resolveActivePath } from '../utils/resolveActivePath';
import { arraysEqual } from '../utils/arraysEqual';
import { TemplateSource } from '../types/TemplateSource';
import { getSubMenu } from '../utils/getSubMenu';
import { expectString } from '../utils/expectString';
import { removeInvisibleMenuItems } from '../utils/removeInvisibleMenuItems';

export const render = (
  env: nunjucks.Environment,
  menu: readonly MenuItem[],
  plugins: readonly Plugin[],
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

  // Add dummy root item if the active path is empty
  if (activePath.length === 0) {
    activePath = [
      {
        uri: frontUri,
        slug: '',
        title: renderVars.siteTitle as string,
        breadcrumbTitle: renderVars.siteTitle as string,
        children: [],
        visible: true,
        attributes: {},
      },
    ];
  }

  if (isNotRoot && notAlreadyInActivePath) {
    const slug = lastOf(context.uri);
    activePath = [
      ...activePath,
      {
        uri: context.uri,
        slug,
        title: vars.title as string || slug,
        breadcrumbTitle: vars.title as string || slug,
        children: [],
        visible: true,
        attributes: {},
      },
    ];
  }

  const renderContext: RenderContext = {
    activePath,
    strings: context.strings,
  };

  const frontUriStr = joinUri(frontUri);
  const currentUri = joinUri(cleanUri(context.uri));

  const finalVars: Record<string, unknown> = {
    ...renderVars,
    front: frontUriStr === currentUri,
    uri: currentUri,
    menu: removeInvisibleMenuItems(menuRoot),
    frontUri: frontUriStr,
    breadcrumbs: renderContext.activePath,
    strings: context.strings,
    _renderContext: renderContext,
  };

  let hookOptions: RenderOptions = {
    template,
    vars: finalVars,
  };
  for (const plugin of plugins) {
    if (!plugin.onPreRender) continue;
    hookOptions = plugin.onPreRender(hookOptions);
  }

  let rendered: string;

  if (hookOptions.template.name) {
    rendered = env.render(hookOptions.template.name, hookOptions.vars);
  } else if (hookOptions.template.content) {
    rendered = env.renderString(hookOptions.template.content, hookOptions.vars);
  } else {
    throw new Error('Either template name or content is required');
  }

  for (const plugin of plugins) {
    if (!plugin.onPostRender) continue;
    rendered = plugin.onPostRender(hookOptions, rendered);
  }

  return rendered;
};
