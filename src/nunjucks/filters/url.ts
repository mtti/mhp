import { ensureNotEndsWith } from '@mtti/funcs';
import { cleanUri } from '../../utils/cleanUri';
import { expectString } from '../../utils/expectString';
import { isStringArray } from '../../utils/isStringArray';
import { joinUri } from '../../utils/joinUri';
import { Post } from '../../Post';
import { NunjucksContext } from '../NunjucksContext';

/**
 * Given an array of URI parts, returns an absolute URL.
 */
export function url(this: NunjucksContext, input: unknown): string {
  let uriParts: string[];
  if (isStringArray(input)) {
    uriParts = input;
  } else if (input instanceof Post) {
    uriParts = [...input.uri];
  } else {
    throw new Error('url filter requires string array or Post');
  }

  const uri = joinUri(cleanUri(uriParts));
  const baseUrl = ensureNotEndsWith(expectString(this.ctx.baseUrl), '/');

  return `${baseUrl}/${uri}`;
}
