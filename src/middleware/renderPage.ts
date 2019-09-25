import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

export function renderPage(name: string): Middleware {
  return async (
    { loadPage, render, write },
    context,
  ): Promise<BuildContext> => {
    const page = await loadPage(name);

    const vars = { ...context.vars, ...page.vars };
    const template = (page.vars.template as string) || 'page.html';

    await write(context.uri, render(context, vars, template));

    return context;
  };
}
