import { cleanUri } from './cleanUri';
import { joinUri } from './joinUri';
import { mustNotEndWith } from './mustNotEndWith';

export function joinUrl(baseUrl: string, uriParts: readonly string[]): string {
  const uri = joinUri(cleanUri(uriParts));
  const cleanedBaseUrl = mustNotEndWith(baseUrl, '/');
  return `${cleanedBaseUrl}/${uri}`;
}
