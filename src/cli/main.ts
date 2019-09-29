#!/usr/bin/env node

import minimist from 'minimist';
import { commands } from './commands';
import { handleProcessEvents } from './handleProcessEvents';

async function main(): Promise<void> {
  handleProcessEvents();

  const args = minimist(process.argv.slice(2));
  const command = args._[0] || 'build';

  const subArgs: minimist.ParsedArgs = {
    ...args,
    _: args._.slice(1),
  };

  const commandFn = commands[command];
  if (!commandFn) {
    throw new Error(`Unrecognized command: ${command}`);
  }

  await commandFn(process.cwd(), subArgs);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
