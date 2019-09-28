import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

export function page(name: string): Middleware {
  return async (
    { loadPage, render, write },
    context,
  ): Promise<BuildContext> => {
    const data = await loadPage(name);

    const vars = { ...context.vars, ...data.vars };
    const template = (data.vars.template as string) || 'page.html';

    await write(context.uri, render(context, vars, template));

    return context;
  };
}
