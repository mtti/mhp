import { NunjucksContext } from '../NunjucksContext';
import { expectStringDictionary } from '../../utils/expectStringDictionary';
import { expectString } from '../../utils/expectString';
import { mustNotEndWith } from '../../utils/mustNotEndWith';

/**
 * Replace the plain name of an asset with its hashed version if an asset
 * manifest is loaded.
 *
 * @param this
 * @param input
 */
export function assetUrl(this: NunjucksContext, input: string): string {
  let filename = input;

  const assetManifest = this.ctx.assetManifest
    ? expectStringDictionary(this.ctx.assetManifest) : {};
  if (input in assetManifest) {
    filename = assetManifest[input];
  }

  const baseUrl = mustNotEndWith(expectString(this.ctx.baseUrl), '/');

  return `${baseUrl}/assets/${filename}`;
}
