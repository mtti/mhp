import { ensureNotEndsWith } from '@mtti/funcs';
import { NunjucksContext } from '../NunjucksContext';
import { expectStringDictionary } from '../../utils/expectStringDictionary';
import { expectString } from '../../utils/expectString';

/**
 * Replace the plain name of an asset with its hashed version if an asset
 * manifest is loaded.
 *
 * @param this
 * @param input
 */
export function assetUrl(this: NunjucksContext, input: string): string {
  let filename = expectString(input);

  // Return absolute URLs unchanged
  if (filename.match(/^[a-z]+:\/\/.+/)) {
    return filename;
  }

  const assetManifest = this.ctx.assetManifest
    ? expectStringDictionary(this.ctx.assetManifest) : {};
  if (input in assetManifest) {
    filename = assetManifest[input];
  }

  const baseUrl = ensureNotEndsWith(expectString(this.ctx.baseUrl), '/');

  return `${baseUrl}/${filename}`;
}
