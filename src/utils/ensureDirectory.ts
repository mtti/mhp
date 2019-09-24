import path from 'path';
import fs from 'fs-extra';

/**
 * Create a directory at a path if it doesn't exist, or throw an error if a
 * non-directory exists with the same name.
 *
 * @param parts One or more path parts pointing to the target directory.
 * @returns The joined string path to the target directory.
 */
export async function ensureDirectory(...parts: string[]): Promise<string> {
  const target = path.join(...parts);
  try {
    const stat = await fs.stat(target);
    if (!stat.isDirectory()) {
      throw new Error(`Not a directory: ${target}`);
    }
    return target;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdirp(target);
      return target;
    }
    throw err;
  }
}
