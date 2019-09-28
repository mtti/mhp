import { Post } from '../Post';

export function mostRecentlyUpdatedPost(posts: readonly Post[]): Post|null {
  if (posts.length === 0) {
    return null;
  }

  let newest = posts[0];

  for (const post of posts.slice(1)) {
    if (post.updatedAt > newest.updatedAt) {
      newest = post;
    }
  }

  return newest;
}
