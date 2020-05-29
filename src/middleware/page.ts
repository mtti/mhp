import marked from 'marked';
import nunjucks from 'nunjucks';
import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';

export function page(name: string): Middleware {
  return async (
    {
      loadPage, render, write, globals,
    }: Environment,
    context: BuildContext,
  ): Promise<BuildContext> => {
    const data = await loadPage(name);

    const vars = {
      ...context.vars,
      ...data.vars,
    };

    let rendered: string;
    if (data.template.name && data.body) {
      let body: nunjucks.runtime.SafeString;
      if (data.extension === '.md') {
        body = new nunjucks.runtime.SafeString(marked(data.body));
      } else {
        throw new Error(`Unsupported page extension: ${data.extension}`);
      }
      rendered = render(
        context,
        { ...vars, body, ...globals },
        data.template,
      );
    } else if (data.template.content) {
      rendered = render(
        context,
        { ...vars, ...globals },
        data.template,
      );
    } else {
      throw new Error(`No template name or content found for page ${name}`);
    }

    await write(context.uri, rendered);

    return context;
  };
}
