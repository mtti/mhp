import { emit } from './emit';
import { expectDirectory } from './utils';
import { loadPosts } from './loadPosts';
import { EmitFunc } from './types/EmitFunc';

export async function build(
  baseDirectory: string,
  main: (emit: EmitFunc) => Promise<void>,
): Promise<void> {
  const postsDirectory = await expectDirectory(baseDirectory, 'posts');
  const posts = await loadPosts(postsDirectory);

  await main(emit(posts));
}
