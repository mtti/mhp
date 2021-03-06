import { expectString } from '../../utils/expectString';
import { getRenderContext } from '../../utils/getRenderContext';
import { NunjucksContext } from '../NunjucksContext';

/**
 * Returns a translated string by key.
 *
 * @param this Nunjucks context
 * @param key Key of the translated string
 */
export function t(
  this: NunjucksContext,
  key: string,
): string {
  const renderContext = getRenderContext(this.ctx);
  const lang = expectString(this.ctx.lang);

  const strings = renderContext.strings[lang];
  if (!strings) {
    throw new Error(`Missing translation: ${key} in language '${lang}'`);
  }

  const result = strings[key];
  if (!result) {
    throw new Error(`Missing translation: ${key} in language '${lang}'`);
  }

  return result;
}
