import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';
import { expectString } from '../utils/expectString';
import { joinUrl } from '../utils/joinUrl';
import { Post } from '../Post';

export type PageOptions = {
  /**
   * The name of the produced HTML file on disk. Use the template variable
   * `{{ page }}` for the page number.
   *
   * The default for the first page is `index.html` and for all other pages
   * `index-{{ page }}.html`.
   */
  filename?: string;

  /** The template used to render the page. */
  template?: string;

  /** Template variables for rendering the page. */
  vars?: Record<string, unknown>;
};

/**
 * Index page generator options.
 */
export type IndexOptions = PageOptions & {
  /** The number of posts to show on each page. */
  postsPerPage: number;

  /** Options specific to the first post page. */
  firstPage?: PageOptions;

  /** Options specific to the last post page. */
  lastPage?: PageOptions;
};

type PagerPage = {
  uri: string[];
  url: string;
  number: number;
  index: number;
  first: boolean;
  last: boolean;
  vars: Record<string, unknown>;
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
      filename: 'index-{{page}}.html',
      postsPerPage: 15,
      template: 'pages/post-index.html',
      vars: {},
      ...(options || {}),
    };

    const totalPages = Math.ceil(context.posts.length / opts.postsPerPage) || 1;

    // Calculate basic information about each index page that will be generated
    const pages: PagerPage[] = [];
    for (let i = 0; i < totalPages; i += 1) {
      let pageOptions: PageOptions = {
        filename: opts.filename,
        template: opts.template,
        vars: opts.vars,
      };

      if (i === totalPages - 1) {
        pageOptions = {
          ...pageOptions,
          ...opts.lastPage,
        };
      }
      if (i === 0) {
        pageOptions = {
          ...pageOptions,
          filename: 'index.html',
          ...opts.firstPage,
        };
      }

      const filename = renderString(
        pageOptions.filename || 'index-{{page}}.html',
        { page: i + 1 },
      );

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
        vars: pageOptions.vars || {},
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
          {
            pager, ...globals, ...opts.vars, ...currentPage.vars,
          },
          { name: opts.template },
        )),
      );
    }
    await Promise.all(promises);

    return context;
  };
}
