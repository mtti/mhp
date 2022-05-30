import { BuildContext } from '../types/BuildContext';
import { Environment } from '../types/Environment';
import { Middleware } from '../types/Middleware';

export type PostOptions = {
  canonical: boolean;
}

/**
 * Create a middleware for generating a post page.
 */
export function posts(options?: PostOptions): Middleware {
  const opts: PostOptions = {
    canonical: true,
    ...options,
  };

  return async (
    { render, write, globals }: Environment,
    context: BuildContext,
  ): Promise<BuildContext> => {
    if (context.posts.length !== 1) {
      throw new Error(`Expected exactly 1 post, got ${context.posts.length}`);
    }

    const post = context.posts[0];

    if (opts.canonical) {
      post.uri = context.uri;
    }

    // Fetch post author metadata using value of the `author` attribute as key
    const author = typeof post.attributes.author === 'string'
      ? context.authors[post.attributes.author] : null;

    let postVars: Record<string, unknown> = {};
    if (post.attributes.vars && typeof post.attributes.vars === 'object') {
      postVars = { ...post.attributes.vars };
    }

    const vars = {
      post,
      title: post.attributes.title,
      author,
      canonicalUrl: post.attributes.canonicalUrl || null,
      ...postVars,
    };

    await write(
      post.uri,
      render(context, { ...vars, ...globals }, { name: 'pages/post.html' }),
      {
        contentType: 'text/html',
      },
    );

    return context;
  };
}
