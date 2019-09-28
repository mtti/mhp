import path from 'path';
import fs from 'fs-extra';
import { WriteFunc, WriteOptions } from '../types/Environment';
import { guessExtension } from '../utils/guessExtension';
import { ensureDirectory } from '../utils/ensureDirectory';

export type WriteCallback = (file: string) => void;

export function write(
  outputDirectory: string,
  dryRun: boolean = false,
  writeCallback?: WriteCallback,
): WriteFunc {
  return async (
    uri: readonly string[],
    content: string,
    options?: WriteOptions,
  ): Promise<void> => {
    const opts = {
      contentType: 'text/html',
      ...(options || {}),
    };

    const fsUri = guessExtension(uri, opts.contentType);
    await ensureDirectory(outputDirectory, ...fsUri.slice(0, -1));
    const targetPath = path.join(outputDirectory, ...fsUri);

    if (writeCallback) {
      writeCallback(targetPath);
    }

    if (!dryRun) {
      await fs.writeFile(targetPath, content);
    }
  };
}
