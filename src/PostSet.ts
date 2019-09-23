import { findFiles } from './utils';
import { FileInfo } from './types';
import { Post } from './Post';

export class PostSet {
  /**
   * Load posts recursively from a directory.
   *
   * @param directory
   */
  static async loadDirectory(directory: string): Promise<PostSet> {
    const markdownFiles = await findFiles(
      directory,
      (file: FileInfo) => file.extension === '.md',
    );
    return new PostSet(await Promise.all(
      markdownFiles.map((file: FileInfo) => Post.load(file)),
    ));
  }

  private _posts: Post[];

  constructor(posts: Post[]) {
    this._posts = posts;
  }

  /**
   * Create a new PostSet from a subset of posts that match a filter.
   *
   * @param filter
   */
  filtered(filter: (post: Post) => boolean): PostSet {
    return new PostSet(this._posts.filter(filter));
  }

  /**
   * Create a new PostSet with the posts sorted by a callback.
   *
   * @param sorter
   */
  sorted(sorter: (a: Post, b: Post) => number): PostSet {
    return new PostSet(this._posts.sort(sorter));
  }
}
