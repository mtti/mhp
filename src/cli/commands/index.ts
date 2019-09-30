import { CommandHandlers } from '../types/CommandHandlers';
import { build } from './build';
import { serve } from './serve';

export const commands: CommandHandlers = {
  build,
  serve,
};
