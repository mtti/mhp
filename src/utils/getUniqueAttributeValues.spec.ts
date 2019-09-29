import { Post } from '../Post';
import { getUniqueAttributeValues } from './getUniqueAttributeValues';

function makePost(attributes: Record<string, unknown>): Post {
  return {
    attributes,
  } as Post;
}

describe(getUniqueAttributeValues.name, () => {
  describe('with string and number values', () => {
    it('returns unique values and converts numbers to strings', () => {
      const posts = [
        makePost({ category: 'bacon' }),
        makePost({ category: 'eggs' }),
        makePost({ category: 'bacon' }),
        makePost({ category: 42 }),
      ];

      const result = getUniqueAttributeValues(posts, 'category');
      result.sort();

      expect(result.length).toBe(3);
      expect(result).toEqual(['42', 'bacon', 'eggs']);
    });
  });

  describe('with some non-string values', () => {
    it('ignores the non-string values', () => {
      const posts = [
        makePost({ category: 'bacon' }),
        makePost({ category: null }),
        makePost({ category: 'bacon' }),
      ];

      const result = getUniqueAttributeValues(posts, 'category');
      expect(result.length).toBe(1);
    });
  });

  describe('with array values', () => {
    it('treats individual array items as distinct values', () => {
      const posts = [
        makePost({ tags: ['bacon', 'eggs'] }),
      ];
      const result = getUniqueAttributeValues(posts, 'tags');
      result.sort();

      expect(result).toEqual(['bacon', 'eggs']);
    });
  });
});
