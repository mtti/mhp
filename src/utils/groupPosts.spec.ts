import { fromEntries } from '@mtti/funcs';
import { Post } from '../Post';
import { groupPosts } from './groupPosts';

function makePost(attributes: Record<string, unknown>): Post {
  return {
    attributes,
  } as Post;
}

describe(groupPosts.name, () => {
  describe('with string values', () => {
    it('groups posts by value', () => {
      const posts = [
        makePost({ category: 'bacon' }),
        makePost({ category: 'eggs' }),
        makePost({ category: 'bacon' }),
      ];

      const entries = groupPosts(posts, 'category');
      const map: Record<string, readonly Post[]> = fromEntries(entries);

      expect(entries.length).toBe(2);
      expect(map.bacon).toEqual([posts[0], posts[2]]);
      expect(map.eggs).toEqual([posts[1]]);
    });
  });

  describe('with some non-string values', () => {
    it('ignores the non-string values', () => {
      const posts = [
        makePost({ category: 'bacon' }),
        makePost({ category: null }),
        makePost({ category: 'bacon' }),
      ];

      const entries = groupPosts(posts, 'category');
      const map: Record<string, readonly Post[]> = fromEntries(entries);

      expect(entries.length).toBe(1);
      expect(map.bacon).toEqual([posts[0], posts[2]]);
    });
  });

  describe('with string arrays', () => {
    it('treats array items as distinct values', () => {
      const posts = [
        makePost({ tags: ['bacon', 'eggs'] }),
        makePost({ tags: ['bacon'] }),
      ];

      const entries = groupPosts(posts, 'tags');
      const map: Record<string, readonly Post[]> = fromEntries(entries);

      expect(entries.length).toBe(2);
      expect(map.bacon).toEqual([posts[0], posts[1]]);
      expect(map.eggs).toEqual([posts[0]]);
    });
  });
});
