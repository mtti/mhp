import fs from 'fs-extra';

/**
 * Try loading files from a list and return the content of the first one that
 * can be loaded.
 *
 * @param files
 */
export async function tryFiles(files: string[]): Promise<string|null> {
  const tryFile = async (file: string): Promise<string|null> => {
    try {
      return await fs.readFile(file, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  };

  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const result = await tryFile(file);
    if (result) {
      return result;
    }
  }

  return null;
}
