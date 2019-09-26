import nunjucks from 'nunjucks';
import { TemplateLoader } from './TemplateLoader';
import { assetUrl } from './filters/assetUrl';
import { formatDate } from './filters/formatDate';
import { url } from './filters/url';

export function createNunjucksEnv(
  templateDirectories: readonly string[],
): nunjucks.Environment {
  const env = new nunjucks.Environment(
    new TemplateLoader(templateDirectories),
  );

  env.addFilter('assetUrl', assetUrl);
  env.addFilter('formatDate', formatDate);
  env.addFilter('url', url);

  return env;
}
