import { Post } from '../Post';

/**
 * Check if a post's attribute contains a value. If the attribute's value is
 * an array, it must contain `value` for this function to return `true`. If
 * it's not an array, the attribute must be a string and must equal `value`.
 *
 * @param post
 * @param key
 * @param value
 */
export function attributeEqualsOrIncludes(
  post: Post,
  key: string,
  value: string,
): boolean {
  const actualValue = post.attributes[key];
  if (Array.isArray(actualValue)) {
    return actualValue.includes(value);
  }
  return actualValue === value;
}
