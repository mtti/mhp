import { MenuItemConfig } from '../types/MenuItemConfig';
import { isInActivePath } from './isInActivePath';

const activePath: MenuItemConfig[] = [
  { slug: 'first' },
  { slug: 'second' },
  { slug: 'third' },
];

describe(isInActivePath.name, () => {
  it('returns true when entire URI is in active path', () => {
    const result = isInActivePath(['first', 'second', 'third'], activePath);
    expect(result).toBe(true);
  });

  it('returns true when URI covers part of active path', () => {
    const result = isInActivePath(['first', 'second'], activePath);
    expect(result).toBe(true);
  });

  it('returns false when uri is longer than active path', () => {
    const result = isInActivePath(
      ['first', 'second', 'third', 'foo'],
      activePath,
    );
    expect(result).toBe(false);
  });

  it('returns false when encountering element not in active path', () => {
    const result = isInActivePath(
      ['first', 'second', 'foo'],
      activePath,
    );
    expect(result).toBe(false);
  });
});
