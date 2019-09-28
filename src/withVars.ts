import { Environment } from './types/Environment';
import { WithVarsFunc } from './types/withVars';
import { Post } from './Post';
import { emit } from './emit';

export function withVars(
  env: Environment,
  posts: readonly Post[],
  assetManifest: Record<string, string>,
  baseVars: Record<string, unknown> = {},
): WithVarsFunc {
  return async (vars, body): Promise<void> => {
    const combinedVars = {
      ...baseVars,
      ...vars,
    };

    await body({
      emit: emit(env, posts, assetManifest, combinedVars),
      withVars: withVars(env, posts, assetManifest, combinedVars),
    });
  };
}
