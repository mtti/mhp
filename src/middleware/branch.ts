import { Middleware } from '../types/Middleware';
import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { splitUri } from '../utils/splitUri';
import { getUriParameters } from '../utils/getUriParameters';
import { groupPosts } from '../utils/groupPosts';
import { replaceUriParameter } from '../utils/replaceUriParameter';
import { compose } from './compose';

async function branchInner(
  env: Environment,
  context: BuildContext,
  middleware: Middleware[],
): Promise<BuildContext> {
  // If there are any URI parameters in the path, create hidden branches for
  // each possible value.
  const groupKeys = getUriParameters(context.uri);
  if (groupKeys.length > 0) {
    const [head] = groupKeys;
    const groups = groupPosts(context.posts, head);

    await Promise.all(
      groups.map(([key, posts]): Promise<BuildContext> => branchInner(
        env,
        {
          ...context,
          vars: {
            ...context.vars,
            $groups: {
              ...(context.vars.$groups as any),
              [head]: key,
            },
          },
          uri: replaceUriParameter(context.uri, head, key),
          posts,
        },
        middleware,
      )),
    );

    return context;
  }

  // There were no parameters in this invocation, run middleware normally.
  await compose(...middleware)(env, context);
  return context;
}

export function branch(uri: string, ...middleware: Middleware[]): Middleware {
  return async (
    env: Environment,
    context: BuildContext,
  ): Promise<BuildContext> => {
    await branchInner(
      env,
      {
        ...context,
        uri: [...context.uri, ...splitUri(uri)],
      },
      middleware,
    );
    // Return original unmodified context as we do not want changes made by
    // sub-middleware to propagate down the original pipe.
    return context;
  };
}
