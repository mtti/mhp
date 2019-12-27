import { Post } from '../Post';
import { AuthorConfig } from './AuthorConfig';

export type BuildContext = {
  readonly authors: Record<string, AuthorConfig>;
  readonly uri: readonly string[];
  readonly posts: readonly Post[];
  readonly vars: Record<string, unknown>;
  readonly strings: Record<string, Record<string, string>>;
};
