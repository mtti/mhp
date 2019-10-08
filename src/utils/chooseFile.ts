import path from 'path';
import { fileExists } from './fileExists';

/**
 * Return the first file that exists from a list of files.
 *
 * @param basePath
 * @param filenames
 */
export async function chooseFile(
  basePath: string,
  filenames: string[],
): Promise<string|null> {
  for (const filename of filenames) {
    const fullPath = path.join(basePath, filename);
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(fullPath)) {
      return fullPath;
    }
  }
  return null;
}
