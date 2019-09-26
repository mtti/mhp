import path from 'path';
import fs from 'fs-extra';
import { WriteFunc } from '../types/Environment';
import { ensureDirectory } from '../utils/ensureDirectory';

export type WriteCallback = (file: string) => void;

export type WriteOptions = {

};

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
    await ensureDirectory(outputDirectory, ...uri.slice(0, -1));
    const targetPath = path.join(outputDirectory, ...uri);

    if (writeCallback) {
      writeCallback(targetPath);
    }

    if (!dryRun) {
      await fs.writeFile(targetPath, content);
    }
  };
}
