import { expectDirectory } from './utils';
import { loadPosts } from './loadPosts';
import { BuildContext } from './types/BuildContext';
import { EmitFunc } from './types/EmitFunc';
import { Middleware } from './types/Middleware';
import { splitUri } from './utils/splitUri';

export async function build(
  baseDirectory: string,
  main: (emit: EmitFunc) => Promise<void>,
): Promise<void> {
  const postsDirectory = await expectDirectory(baseDirectory, 'posts');
  const posts = await loadPosts(postsDirectory);

  const emit = async (
    uri: string,
    ...middleware: Middleware[]
  ): Promise<void> => {
    let context: BuildContext = {
      posts,
      uri: splitUri(uri),
      globals: {},
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const currentMiddleware of middleware) {
      // eslint-disable-next-line no-await-in-loop
      context = await currentMiddleware(context);
    }
  };

  await main(emit);
}
