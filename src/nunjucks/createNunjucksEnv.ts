import nunjucks from 'nunjucks';
import { TemplateLoader } from './TemplateLoader';
import { assetUrl } from './filters/assetUrl';
import { formatDate } from './filters/formatDate';
import { url } from './filters/url';

// Wrap a filter function to print out proper stack trace in case of error
function wrapFilter(filter: (...args: any[]) => any): (...args: any[]) => any {
  return function wrappedFilter(this: unknown, ...args: unknown[]): unknown {
    try {
      return filter.call(this, ...args);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err.stack);
      process.exit(1);
      throw err;
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

  return env;
}
