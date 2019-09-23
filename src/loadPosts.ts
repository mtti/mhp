import { findFiles } from './utils';
import { FileInfo } from './types/FileInfo';
import { Post } from './Post';

/**
 * Load posts recursively from a directory.
 *
 * @param directory
 */
export async function loadPosts(directory: string): Promise<Post[]> {
  const markdownFiles = await findFiles(
    directory,
    (file: FileInfo) => file.extension === '.md',
  );
  return Promise.all(
    markdownFiles.map((file: FileInfo) => Post.load(file)),
  );
}
