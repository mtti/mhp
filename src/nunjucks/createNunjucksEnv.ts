import nunjucks from 'nunjucks';
import { TemplateLoader } from './TemplateLoader';
import { assetUrl } from './filters/assetUrl';
import { formatDate } from './filters/formatDate';
import { url } from './filters/url';
import { isInActivePath } from './functions/isInActivePath';
import { t } from './functions/t';
import { MarkdownExtension } from './MarkdownExtension';

// Wrap a filter function to print out proper stack trace in case of error
function wrapFilter(filter: (...args: any[]) => any): (...args: any[]) => any {
  // eslint-disable-next-line consistent-return
  return function wrappedFilter(this: unknown, ...args: unknown[]): unknown {
    try {
      return filter.call(this, ...args);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.log(`Fatal error in filter ${filter.name}: \n ${err.stack}`);
      process.exit(1);
    }
  };
}

export function createNunjucksEnv(
  templateDirectories: readonly string[],
): nunjucks.Environment {
  const env = new nunjucks.Environment(
    new TemplateLoader(templateDirectories),
  );

  env.addFilter('assetUrl', wrapFilter(assetUrl));
  env.addFilter('formatDate', wrapFilter(formatDate));
  env.addFilter('url', wrapFilter(url));

  env.addGlobal('isInActivePath', isInActivePath);
  env.addGlobal('t', t);

  env.addExtension('MarkdownExtension', new MarkdownExtension());

  return env;
}
