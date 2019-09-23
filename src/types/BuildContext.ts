import { Post } from '../Post';

export type BuildContext = {
  readonly uri: readonly string[];
  readonly posts: readonly Post[];
  readonly globals: Record<string, unknown>;
};
