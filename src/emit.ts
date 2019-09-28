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
import { compose } from './middleware/compose';

export const emit = (
  env: Environment,
  posts: readonly Post[],
  assetManifest: Record<string, string>,
  vars?: Record<string, unknown>,
): EmitFunc => (
  async (uri: string, ...middleware: Middleware[]): Promise<void> => {
    const uriParts = splitUri(uri);
    const groupKeys = getUriParameters(uriParts);

    if (groupKeys.length > 0) {
      const [head] = groupKeys;
      const groups = groupPosts(posts, head);
      await Promise.all(groups
        .map(([key, postsInGroup]) => emit(
          env,
          postsInGroup,
          assetManifest,
          vars,
        )(
          joinUri(replaceUriParameter(uriParts, head, key)),
          ...middleware,
        )));
      return;
    }

    let ctx: BuildContext = {
      posts,
      uri: splitUri(uri),
      vars: {
        assetManifest,
      },
    };

    if (vars) {
      ctx = {
        ...ctx,
        vars: { ...vars, ...ctx.vars },
      };
    }

    await compose(...middleware)(env, ctx);
  }
);
