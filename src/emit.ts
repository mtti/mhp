import { BuildContext } from './types/BuildContext';
import { EmitFunc } from './types/EmitFunc';
import { Middleware } from './types/Middleware';
import { splitUri } from './utils/splitUri';
import { Post } from './Post';

export const emit = (posts: Post[]): EmitFunc => (
  async (uri: string, ...middleware: Middleware[]): Promise<void> => {
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
  }
);
