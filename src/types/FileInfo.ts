import fs from 'fs';

export type FileInfo = {
  path: string;
  stat: fs.Stats;
  extension: string;
};
