import { mustNotStartWith } from './mustNotStartWith';
import { mustNotEndWith } from './mustNotEndWith';

export function splitUri(uri: string): string[] {
  const cleanedUri = mustNotStartWith(mustNotEndWith(uri, '/'), '/');
  return cleanedUri.split('/');
}
