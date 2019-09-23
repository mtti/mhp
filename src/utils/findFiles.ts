import { FileInfo } from '../types';
import { flatten } from './flatten';
import { listDirectory } from './listDirectory';

/**
 * Recursively find files that match the filter in a directory and its
 * subdirectories.
 *
 * @param directory
 * @param filter
 */
export async function findFiles(
  directory: string,
  filter: (file: FileInfo) => boolean,
): Promise<FileInfo[]> {
  const items = await listDirectory(directory);

  const ownFiles = items
    .filter((item) => item.stat.isFile())
    .filter(filter);

  const subdirPromises = items
    .filter((item) => item.stat.isDirectory())
    .map((subdirectory) => findFiles(subdirectory.path, filter));
  const subdirFiles = flatten(await Promise.all(subdirPromises));

  return [...ownFiles, ...subdirFiles];
}
