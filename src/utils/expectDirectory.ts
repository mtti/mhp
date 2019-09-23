import path from 'path';
import fs from 'fs-extra';

export async function expectDirectory(...parts: string[]): Promise<string> {
  const target = path.join(...parts);
  const stat = await fs.stat(target);
  if (!stat.isDirectory()) {
    throw new Error(`Not a directory: ${target}`);
  }
  return target;
}
