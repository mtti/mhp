import { ensureNotEndsWith } from '@mtti/funcs';
import { cleanUri } from './cleanUri';
import { joinUri } from './joinUri';

export function joinUrl(baseUrl: string, uriParts: readonly string[]): string {
  const uri = joinUri(cleanUri(uriParts));
  const cleanedBaseUrl = ensureNotEndsWith(baseUrl, '/');
  return `${cleanedBaseUrl}/${uri}`;
}
