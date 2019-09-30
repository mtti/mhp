import path from 'path';
import express from 'express';
import minimist from 'minimist';
import { expectNumber } from '../../utils/expectNumber';

export async function serve(
  baseDirectory: string,
  args: minimist.ParsedArgs,
): Promise<void> {
  const port = args.port ? expectNumber(args.port) : 8080;

  const app = express();

  app.use(express.static(path.join(baseDirectory, 'dist'), {
    extensions: ['html'],
  }));

  app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
}
