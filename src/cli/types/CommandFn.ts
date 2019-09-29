import minimist from 'minimist';

export type CommandFn = (
  baseDirectory: string,
  args: minimist.ParsedArgs,
) => Promise<void>;
