import { MenuItem } from '../types/MenuItem';
import { resolveActivePath } from './resolveActivePath';
import { resolveMenu } from './resolveMenu';

const crumbs: MenuItem[] = resolveMenu([
  {
    slug: 'cats',
    title: 'Cats',
    children: [
      {
        slug: 'big',
        title: 'Big',
        children: [
          { slug: 'lion', title: 'Lion' },
        ],
      },
      {
        slug: 'small',
        title: 'Small',
        children: [
          { slug: 'ocelot', title: 'Ocelot' },
        ],
      },
    ],
  },
  {
    slug: 'not-cats',
    title: 'Not cats',
    children: [],
  },
]);

describe(resolveActivePath.name, () => {
  it('returns empty array when given an empty path', () => {
    const result = resolveActivePath(crumbs, []);
    expect(result).toEqual([]);
  });

  it('correctly resolves when all path segments have a breadcrumb', () => {
    const result = resolveActivePath(crumbs, ['cats', 'big', 'lion'])
      .map((crumb) => crumb.title);
    expect(result).toEqual(['Cats', 'Big', 'Lion']);
  });

  it('only resolves up to where breadcrumbs exist', () => {
    const result = resolveActivePath(crumbs, ['cats', 'big', 'tiger', 'bengal'])
      .map((crumb) => crumb.title);
    expect(result).toEqual(['Cats', 'Big']);
  });
});
