import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';
import { SafeString, noEscape } from '../utils/noEscape';

export function page(name: string): Middleware {
  return async (
    {
      loadPage, render, write, globals, renderMarkdown,
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
      let body: SafeString;
      if (data.extension === '.md') {
        body = noEscape(renderMarkdown(data.body));
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

    // Special case for generating a page at site root
    const uri = context.uri.length > 0 ? context.uri : ['index'];

    await write(uri, rendered);

    return context;
  };
}
