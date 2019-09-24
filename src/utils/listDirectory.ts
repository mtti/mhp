import path from 'path';
import fs from 'fs-extra';
import { FileInfo } from '../types/FileInfo';

/**
 * List all files and subdirectories in a directory.
 *
 * @param directory Path to the directory to list.
 */
export async function listDirectory(directory: string): Promise<FileInfo[]> {
  const filenames = await fs.readdir(directory);
  const promises = filenames.map(async (filename): Promise<FileInfo> => {
    const filePath = path.join(directory, filename);
    const stat = await fs.stat(filePath);
    return {
      name: path.basename(filename, path.extname(filename)),
      path: filePath,
      stat,
      extension: path.extname(filePath),
    };
  });
  return Promise.all(promises);
}
