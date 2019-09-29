import fs from 'fs-extra';

/**
 * Check if a file exists.
 *
 * @param file
 */
export async function fileExists(file: string): Promise<boolean> {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
