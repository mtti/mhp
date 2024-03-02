import { Feed } from 'feed';
import { BuildContext } from '../types/BuildContext';
import { Middleware } from '../types/Middleware';
import { expectString } from '../utils/expectString';
import { mostRecentlyUpdatedPost } from '../utils/mostRecentlyUpdatedPost';
import { joinUrl } from '../utils/joinUrl';

export type FeedMiddlewareOptions = {
  title: string;
  uuid: string;
  maxPosts?: number;
  copyright?: string;
  description?: string;
};

/**
 * Generate an RSS feed at the current path.
 */
export const rss = (options: FeedMiddlewareOptions): Middleware => {
  const opts = {
    copyright: '',
    description: '',
    ...options,
  };

  return async ({ write }, context: BuildContext): Promise<BuildContext> => {
    const posts = opts.maxPosts
      ? context.posts.slice(0, opts.maxPosts) : context.posts;

    const newest = mostRecentlyUpdatedPost(posts);

    const items = await Promise.all(posts.map(async (post) => ({
      title: expectString(post.attributes.title),
      id: `urn:uuid:${post.uuid}`,
      guid: post.uuid,
      link: joinUrl(expectString(context.vars.baseUrl), post.uri),
      content: post.render(),
      date: post.publishedAt.toJSDate(),
    })));

    const rssFeed = new Feed({
      title: opts.title,
      id: `urn:uuid:${opts.uuid}`,
      copyright: opts.copyright,
      updated: newest ? newest.updatedAt.toJSDate() : undefined,
      link: joinUrl(expectString(context.vars.baseUrl), context.uri),
      description: opts.description,
    });
    for (const item of items) {
      rssFeed.addItem(item);
    }

    await write(
      context.uri,
      rssFeed.rss2(),
      {
        contentType: 'application/rss+xml',
      },
    );

    return context;
  };
};
