import marked from 'marked';
import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';

export function page(name: string): Middleware {
  return async (
    { loadPage, render, write },
    context,
  ): Promise<BuildContext> => {
    const data = await loadPage(name);

    const vars = {
      ...context.vars,
      ...data.vars,
      body: new nunjucks.runtime.SafeString(marked(data.body)),
    };
    const template = data.template || 'page.html';

    await write(context.uri, render(context, vars, template));

    return context;
  };
}
