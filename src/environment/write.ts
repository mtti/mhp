import { WriteFunc } from '../types/Environment';

export function write(outputDirectory: string): WriteFunc {
  return async (uri: string[], content: string): Promise<void> => {

  };
}
