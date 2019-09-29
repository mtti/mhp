import path from 'path';
import fs from 'fs-extra';

/**
 * Returns the joined path of a directory if that directory exists, or `null``
 * if the directory does not exist.
 *
 * @param parts One or more path parts pointing to the target directory.
 * @returns The joined string path to the target directory or `null` if the
 *   target directory doesn't exist.
 */
export async function checkDirectory(
  ...parts: string[]
): Promise<string|null> {
  const target = path.join(...parts);
  try {
    const stat = await fs.stat(target);
    if (!stat.isDirectory()) {
      return null;
    }
    return target;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
