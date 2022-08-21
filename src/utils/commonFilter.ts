import { Post } from '../Post';

export const commonFilter = (post: Post): boolean => {
  // Hide posts marked with `hidden: true`.
  if (post.attributes.hidden) return false;

  // Hide drafts in a production build.
  if (process.env.NODE_ENV === 'production' && post.attributes.draft) {
    return false;
  }

  return true;
};
