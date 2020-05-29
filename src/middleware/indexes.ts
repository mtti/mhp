import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';
import { expectString } from '../utils/expectString';
import { joinUrl } from '../utils/joinUrl';
import { Post } from '../Post';

export type IndexOptions = {
  firstPageFilename: string|null;
  filenameTemplate: string;
  postsPerPage: number;
  template: string;
};

type PagerPage = {
  uri: string[];
  url: string;
  number: number;
  index: number;
  first: boolean;
  last: boolean;
  next?: PagerPage;
  previous?: PagerPage;
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
export function indexes(
  options?: Partial<IndexOptions>,
): Middleware {
  return async (
    {
      render, renderString, write, globals,
    }: Environment,
    context: BuildContext,
  ): Promise<BuildContext> => {
    const opts: IndexOptions = {
      firstPageFilename: 'index.html',
      filenameTemplate: 'index-{{page}}.html',
      postsPerPage: 15,
      template: 'pages/post-index.html',
      ...(options || {}),
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
        uri: [...context.uri, filename],
        url: joinUrl(
          expectString(context.vars.baseUrl),
          [...context.uri, filename],
        ),
        number: i + 1,
        index: i,
        first: i === 0,
        last: i === totalPages - 1,
      });
    }

    // Set references to next and previous page
    for (let i = 0; i < pages.length; i += 1) {
      if (i < pages.length - 1) {
        pages[i].next = pages[i + 1];
      }
      if (i > 0) {
        pages[i].previous = pages[i - 1];
      }
    }

    // Render and write pager pages to disk
    const promises: Promise<void>[] = [];
    for (let i = 0; i < totalPages; i += 1) {
      const skip = i * opts.postsPerPage;
      const currentPage = pages[i];

      const pager: Pager = {
        pages,
        first: pages[0],
        last: pages.slice(-1)[0],
        current: pages[i],
        total: totalPages,
        posts: context.posts.slice(skip, skip + opts.postsPerPage),
      };

      promises.push(
        write(currentPage.uri, render(
          context,
          { pager, ...globals },
          { name: opts.template },
        )),
      );
    }
    await Promise.all(promises);

    return context;
  };
}
