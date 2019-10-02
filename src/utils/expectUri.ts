import { splitUri } from './splitUri';
import { isStringArray } from './isStringArray';

export function expectUri(source: string|string[]): string[] {
  if (Array.isArray(source)) {
    if (!isStringArray(source)) {
      throw new Error('Expected string array');
    }
    return source;
  }

  if (typeof source !== 'string') {
    throw new Error('Expected string or string array');
  }

  return splitUri(source);
}
