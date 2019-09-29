import { CommandFn } from './CommandFn';

export type CommandHandlers = {
  [key: string]: CommandFn;
};
