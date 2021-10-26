import fs from 'fs-extra';
import { removeFalsies } from '@mtti/funcs';

/**
 * Filter out paths that do not point to directories.
 *
 * @param directories
 */
export async function checkDirectories(
  directories: readonly string[],
): Promise<string[]> {
  const promises = directories.map(async (directory): Promise<string|null> => {
    try {
      const stat = await fs.stat(directory);
      if (!stat.isDirectory()) {
        return null;
      }
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return null;
      }
    }
    return directory;
  });

  return removeFalsies(await Promise.all(promises));
}
