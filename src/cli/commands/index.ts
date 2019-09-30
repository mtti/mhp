import { CommandHandlers } from '../types/CommandHandlers';
import { build } from './build';
import { createPost } from './create-post';
import { serve } from './serve';

export const commands: CommandHandlers = {
  build,
  'create-post': createPost,
  serve,
};
