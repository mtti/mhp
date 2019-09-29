import { fileExists } from './fileExists';

/**
 * From a list of files pick the first one that exists or `null` if none of
 * them exist.
 *
 * @param files
 */
export async function pickFile(
  ...files: readonly string[]
): Promise<string|null> {
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(file)) {
      return file;
    }
  }
  return null;
}
