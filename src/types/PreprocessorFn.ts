import { Post } from '../Post';

export type PreprocessorFn = (post: Post) => Promise<Post>;
