import minimist from 'minimist';

export type CommandFn = (args: minimist.ParsedArgs) => Promise<void>;
