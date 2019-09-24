import { BuildContext } from './types/BuildContext';
import { EmitFunc } from './types/EmitFunc';
import { Environment } from './types/Environment';
import { Middleware } from './types/Middleware';
import { getUriParameters } from './utils/getUriParameters';
import { groupPosts } from './utils/groupPosts';
import { joinUri } from './utils/joinUri';
import { replaceUriParameter } from './utils/replaceUriParameter';
import { splitUri } from './utils/splitUri';
import { Post } from './Post';

export const emit = (
  env: Environment,
  posts: Post[],
): EmitFunc => (
  async (uri: string, ...middleware: Middleware[]): Promise<void> => {
    const uriParts = splitUri(uri);
    const groupKeys = getUriParameters(uriParts);

    if (groupKeys.length > 0) {
      const [head] = groupKeys;
      const groups = groupPosts(posts, head);
      await Promise.all(groups
        .map(([key, postsInGroup]) => emit(env, postsInGroup)(
          joinUri(replaceUriParameter(uriParts, head, key)),
          ...middleware,
        )));
      return;
    }

    let context: BuildContext = {
      posts,
      uri: splitUri(uri),
      globals: {},
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const currentMiddleware of middleware) {
      // eslint-disable-next-line no-await-in-loop
      context = await currentMiddleware(env, context);
    }
  }
);
