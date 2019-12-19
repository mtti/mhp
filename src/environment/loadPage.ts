import path from 'path';
import { LoadPageFunc } from '../types/Environment';
import { Page } from '../types/Page';
import { chooseFile } from '../utils/chooseFile';
import { FrontMatterDocument, readFrontMatter } from '../utils/readFrontMatter';

export function loadPage(pagesDirectory: string|null): LoadPageFunc {
  if (!pagesDirectory) {
    return async (): Promise<Page> => {
      throw new Error('No page directory defined');
    };
  }

  return async (name: string): Promise<Page> => {
    // If the page name has no extension, try some possibilities
    let possibleFilenames: string[];
    if (path.extname(name)) {
      possibleFilenames = [name];
    } else {
      possibleFilenames = [
        `${name}.md`,
        `${name}.html`,
      ];
    }

    // Find the first filename option that exists
    const fullPath = await chooseFile(pagesDirectory, possibleFilenames);
    if (!fullPath) {
      throw new Error(`Page does not exist: ${name}`);
    }
    const extension = path.extname(fullPath);

    let data: FrontMatterDocument;
    if (extension === '.md') {
      data = await readFrontMatter(fullPath, '---', '---', true);
    } else if (extension === '.html') {
      data = await readFrontMatter(fullPath, '<!--', '-->', true);
    } else {
      throw new Error(`Unsupported page extension: ${extension}`);
    }

    const vars = data.attributes.vars
      ? (data.attributes.vars as Record<string, unknown>) : {};

    if (extension === '.html') {
      return {
        template: { content: data.body },
        vars,
        extension,
      };
    }

    const templateName = (data.attributes.template as string)
      || 'pages/page.html';
    return {
      body: data.body,
      template: { name: templateName },
      vars,
      extension,
    };
  };
}
