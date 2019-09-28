import { findFiles } from './utils';
import { FileInfo } from './types/FileInfo';
import { Post } from './Post';
import { sortPostsByDate } from './sort/sortPostsByDate';

/**
 * Load posts recursively from a directory.
 *
 * @param directory
 */
export async function loadPosts(directory: string): Promise<readonly Post[]> {
  const markdownFiles = await findFiles(
    directory,
    (file: FileInfo) => file.extension === '.md',
  );
  const posts = await Promise.all(
    markdownFiles.map((file: FileInfo) => Post.load(file)),
  );
  return posts.sort(sortPostsByDate);
}
