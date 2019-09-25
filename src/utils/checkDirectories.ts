import fs from 'fs-extra';

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
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
    }
    return directory;
  });

  const reducer = (acc: string[], current: string|null): string[] => (
    current ? [...acc, current] : acc
  );

  return (await Promise.all(promises)).reduce(reducer, []);
}
