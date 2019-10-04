import { ensureNotEndsWith } from '@mtti/funcs';
import { cleanUri } from '../../utils/cleanUri';
import { expectString } from '../../utils/expectString';
import { joinUri } from '../../utils/joinUri';
import { Post } from '../../Post';
import { NunjucksContext } from '../NunjucksContext';
import { expectUri } from '../../utils/expectUri';

/**
 * Given an array of URI parts, returns an absolute URL.
 */
export function url(this: NunjucksContext, input: unknown): string {
  let uriParts: string[];
  if (input instanceof Post) {
    uriParts = [...input.uri];
  } else {
    uriParts = expectUri(input);
  }

  const uri = joinUri(cleanUri(uriParts));
  const baseUrl = ensureNotEndsWith(expectString(this.ctx.baseUrl), '/');

  return `${baseUrl}/${uri}`;
}
