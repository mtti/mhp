import { ensureNotEndsWith, ensureNotStartsWith } from '@mtti/funcs';

export function splitUri(uri: string): string[] {
  const cleanedUri = ensureNotStartsWith(ensureNotEndsWith(uri, '/'), '/');
  return cleanedUri ? cleanedUri.split('/') : [];
}
