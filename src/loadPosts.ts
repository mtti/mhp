import { findFiles } from './utils/findFiles';
import { FileInfo } from './types/FileInfo';
import { RenderStringFunc } from './types/RenderStringFunc';
import { Post } from './Post';
import { sortPostsByDate } from './sort/sortPostsByDate';

/**
 * Load posts recursively from a directory.
 *
 * @param directory
 */
export async function loadPosts(
  renderString: RenderStringFunc,
  directory: string,
): Promise<readonly Post[]> {
  const files = await findFiles(
    directory,
    ({ extension }) => extension === '.md' || extension === '.html',
  );

  const posts = await Promise.all(
    files.map((file: FileInfo) => Post.load(renderString, file)),
  );
  return posts.sort(sortPostsByDate);
}
