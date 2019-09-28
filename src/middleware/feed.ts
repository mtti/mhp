import { Feed } from 'feed';
import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';
import { expectString } from '../utils/expectString';
import { mostRecentlyUpdatedPost } from '../utils/mostRecentlyUpdatedPost';
import { suffixUriFilename } from '../utils/suffixUriFilename';

export type FeedMiddlewareOptions = {
  title: string;
  uuid: string;
  maxPosts?: number;
  copyright?: string;
  formats?: string[];
};

/**
 * Create a middleware which filters posts.
 *
 * @param filterFunc
 */
export const feed = (options: FeedMiddlewareOptions): Middleware => {
  const opts = {
    copyright: '',
    formats: ['atom', 'rss'],
    ...options,
  };

  return async ({ write }, context: BuildContext): Promise<BuildContext> => {
    const posts = opts.maxPosts
      ? context.posts.slice(0, opts.maxPosts) : context.posts;

    const newest = mostRecentlyUpdatedPost(posts);

    const feedObj = new Feed({
      title: opts.title,
      id: `urn:uuid:${opts.uuid}`,
      copyright: opts.copyright,
      updated: newest ? newest.updatedAt.toJSDate() : undefined,
    });

    const items = await Promise.all(posts.map(async (post) => ({
      title: expectString(post.attributes.title),
      id: `urn:uuid:${post.uuid}`,
      link: '',
      content: await post.getHtml(),
      date: post.publishedAt.toJSDate(),
    })));

    for (const item of items) {
      feedObj.addItem(item);
    }

    if (opts.formats.includes('atom')) {
      await write(
        suffixUriFilename(context.uri, '.atom.xml'),
        feedObj.atom1(),
        {
          contentType: 'application/atom+xml',
        },
      );
    }
    if (opts.formats.includes('rss')) {
      await write(
        suffixUriFilename(context.uri, '.rss.xml'),
        feedObj.rss2(),
        {
          contentType: 'application/rss+xml',
        },
      );
    }

    return context;
  };
};
