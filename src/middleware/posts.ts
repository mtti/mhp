import { BuildContext } from '../types/BuildContext';
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
    { render, write, globals },
    context,
  ): Promise<BuildContext> => {
    if (context.posts.length !== 1) {
      throw new Error(`Expected exactly 1 post, got ${context.posts.length}`);
    }

    const post = context.posts[0];

    if (opts.canonical) {
      post.uri = context.uri;
    }

    const vars = {
      post,
      title: post.attributes.title,
      ...globals,
    };

    await write(
      post.uri,
      render(context, vars, { name: 'post.html' }),
      {
        contentType: 'text/html',
      },
    );

    return context;
  };
}
