import fs from 'fs';

export type FileInfo = {
  readonly name: string;
  readonly path: string;
  readonly stat: fs.Stats;
  readonly extension: string;
};
