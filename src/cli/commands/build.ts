import path from 'path';
import minimist from 'minimist';
import { pickFile } from '../../utils/pickFile';
import { Middleware } from '../../types/Middleware';
import { build as buildFn } from '../../build';

export async function build(args: minimist.ParsedArgs): Promise<void> {
  const baseDirectory = path.resolve(process.cwd(), args._[0] || '.');

  const rcFile = await pickFile(
    path.join(baseDirectory, 'mhprc.js'),
    path.join(baseDirectory, '.mhprc.js'),
  );
  if (!rcFile) {
    throw new Error(`Could not find settings file in ${baseDirectory}`);
  }

  // eslint-disable-next-line
  const middleware = require(rcFile) as Middleware[];

  await buildFn(baseDirectory, ...middleware);
}
