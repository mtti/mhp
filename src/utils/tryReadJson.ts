import fs from 'fs-extra';

/**
 * Try to load and parse a JSON file if it exists.
 *
 * @param file The file to load.
 */
export async function tryReadJson(
  file: string,
): Promise<Record<string, unknown>> {
  try {
    const src = await fs.readFile(file, 'utf8');
    return JSON.parse(src);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}
