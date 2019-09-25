import path from 'path';

/**
 * Return an URI with the extension of .html files removed and index.html
 * replaced with its containing directory.
 *
 * @param uri URI parts array
 * @returns An URI parts array
 */
export function cleanUri(uri: readonly string[]): string[] {
  const filename = uri.slice(-1)[0];
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
