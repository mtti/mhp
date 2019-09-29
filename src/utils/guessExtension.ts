import mime from 'mime-types';
import { lastOf } from '@mtti/funcs';

/**
 * Guess file name extension from content type if no extension is already
 * present.
 *
 * @param parts
 * @param contentType
 */
export function guessExtension(
  parts: readonly string[],
  contentType: string,
): readonly string[] {
  const filename = lastOf(parts);
  const filenameParts = filename.split('.', 2);

  if (filenameParts.length > 1) {
    return parts;
  }

  const ext = mime.extension(contentType);
  if (!ext) {
    throw new Error(`Unable to guess file extension for ${contentType}`);
  }

  return [
    ...parts.slice(0, -1),
    `${filenameParts[0]}.${ext}`,
  ];
}
