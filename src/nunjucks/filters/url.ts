import { cleanUri } from '../../utils/cleanUri';
import { expectString } from '../../utils/expectString';
import { isStringArray } from '../../utils/isStringArray';
import { joinUri } from '../../utils/joinUri';
import { mustNotEndWith } from '../../utils/mustNotEndWith';
import { Post } from '../../Post';

/**
 * Given an array of URI parts, returns an absolute URL.
 */
export function url(this: any, input: unknown): string {
  let uriParts: string[];
  if (isStringArray(input)) {
    uriParts = input;
  } else if (input instanceof Post) {
    uriParts = [...input.uri];
  } else {
    throw new Error('url filter requires string array or Post');
  }

  const uri = joinUri(cleanUri(uriParts));
  const baseUrl = mustNotEndWith(expectString(this.ctx.baseUrl), '/');

  return `${baseUrl}/${uri}`;
}
