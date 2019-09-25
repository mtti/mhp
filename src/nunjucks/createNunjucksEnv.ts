import nunjucks from 'nunjucks';
import { TemplateLoader } from './TemplateLoader';
import { assetUrl } from './filters/assetUrl';

export function createNunjucksEnv(
  templateDirectories: readonly string[],
): nunjucks.Environment {
  const env = new nunjucks.Environment(
    new TemplateLoader(templateDirectories),
  );

  env.addFilter('assetUrl', assetUrl);

  return env;
}
