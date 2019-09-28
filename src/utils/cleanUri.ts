import path from 'path';
import { lastOf } from './lastOf';

/**
 * Return an URI with the extension of .html files removed and index.html
 * replaced with its containing directory.
 *
 * @param uri URI parts array
 * @returns An URI parts array
 */
export function cleanUri(uri: readonly string[]): string[] {
  if (uri.length === 0) {
    return [];
  }

  const filename = lastOf(uri);
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);

  if (ext === '.html') {
    if (filename === 'index.html') {
      return uri.slice(0, -1);
    }
    return [...uri.slice(0, -1), basename];
  }

  return [...uri];
}
