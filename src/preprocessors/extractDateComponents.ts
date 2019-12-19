import { Post } from '../Post';
import { PreprocessorFn } from '../types/PreprocessorFn';
import { expectDateTime } from '../utils/expectDateTime';

/**
 * A preprocessor which extracts different date components of an attribute into
 * their own separate attributes for use as path variables.
 *
 * @param key Name of the DateTime attribute to extract. If the attribute is
 *    not set, it's ignored.
 */
export function extractDateComponents(key: string): PreprocessorFn {
  return async (post: Post): Promise<Post> => {
    const { attributes } = post;

    if (!attributes[key]) {
      return post;
    }

    const value = expectDateTime(attributes[key]);

    post.set({
      [`${key}Day`]: value.day.toString(),
      [`${key}Month`]: value.month.toString(),
      [`${key}Year`]: value.year.toString(),
    });

    return post;
  };
}
