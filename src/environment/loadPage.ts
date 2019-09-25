import path from 'path';
import fs from 'fs-extra';
import fm from 'front-matter';
import { LoadPageFunc } from '../types/Environment';
import { Page } from '../types/Page';

export function loadPage(pagesDirectory: string|null): LoadPageFunc {
  if (!pagesDirectory) {
    return async (): Promise<Page> => {
      throw new Error('No page directory defined');
    };
  }

  return async (name: string): Promise<Page> => {
    const src = await fs.readFile(path.join(pagesDirectory, name), 'utf8');
    const data = fm(src);
    return {
      body: data.body,
      vars: data.attributes as Record<string, unknown>,
    };
  };
}
