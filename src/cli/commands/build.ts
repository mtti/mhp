import path from 'path';
import { toArray } from '@mtti/funcs';
import minimist from 'minimist';
import { parsePairs } from '../../utils/parsePairs';
import { pickFile } from '../../utils/pickFile';
import { build as buildFn } from '../../build';
import { SiteOptions } from '../types/SiteOptions';

export async function build(
  baseDirectory: string,
  args: minimist.ParsedArgs,
): Promise<void> {
  const rcFile = await pickFile(
    path.join(baseDirectory, 'mhprc.js'),
    path.join(baseDirectory, '.mhprc.js'),
  );
  if (!rcFile) {
    throw new Error(`Could not find settings file in ${baseDirectory}`);
  }

  // Allow setting template variables as key=value pairs with --var
  const varPairs: string[]
    = args.var ? toArray(args.var as string) : [];
  const vars = parsePairs(varPairs);

  // eslint-disable-next-line
  const siteOptions = require(rcFile) as SiteOptions;

  await buildFn(
    baseDirectory,
    {
      authors: siteOptions.authors || [],
      templateDirectories: siteOptions.templateDirectories || [],
      menu: siteOptions.menu || [],
      globals: vars,
    },
  )(...(siteOptions.routes || []));
}
