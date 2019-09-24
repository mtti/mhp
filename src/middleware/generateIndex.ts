import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';
import { Post } from '../Post';
import { joinUri } from '../utils/joinUri';

export type IndexOptions = {
  firstPageFilename: string|null;
  filenameTemplate: string;
  postsPerPage: number;
  template: string;
};

type PagerPage = {
  uri: string[];
  number: number;
  first: boolean;
  last: boolean;
};

type Pager = {
  pages: PagerPage[];
  first: PagerPage;
  last: PagerPage;
  current: PagerPage;
  total: number;
  posts: Post[];
};

/**
 * Create a middleware to set global template variables.
 *
 * @param values A dictionary of values to set.
 */
export function generateIndex(options?: Partial<IndexOptions>): Middleware {
  return async (
    { renderString }: Environment,
    context: BuildContext,
  ): Promise<BuildContext> => {
    const opts: IndexOptions = {
      firstPageFilename: 'index.html',
      filenameTemplate: 'index-{{page}}.html',
      postsPerPage: 15,
      template: 'post-index.html',
      ...options,
    };

    const totalPages = Math.ceil(context.posts.length / opts.postsPerPage) || 1;

    // Calculate basic information about each index page that will be generated
    const pages: PagerPage[] = [];
    for (let i = 0; i < totalPages; i += 1) {
      let filename: string;
      if (i === 0 && opts.firstPageFilename) {
        filename = opts.firstPageFilename;
      } else {
        filename = renderString(
          opts.filenameTemplate,
          { page: i + 1 },
        );
      }

      pages.push({
        uri: [...context.uri, ...filename],
        number: i + 1,
        first: i === 0,
        last: i === totalPages - 1,
      });
    }

    for (let i = 0; i < totalPages; i += 1) {
      const skip = i * opts.postsPerPage;

      const pager: Pager = {
        pages,
        first: pages[0],
        last: pages.slice(-1)[0],
        current: pages[i],
        total: totalPages,
        posts: context.posts.slice(skip, skip + opts.postsPerPage),
      };
    }

    console.log(`Would generate: ${joinUri(context.uri)}`);
    return context;
  };
}
