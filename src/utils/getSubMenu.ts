import { expectSingle } from '@mtti/funcs';
import { MenuItem } from '../types/MenuItem';

/**
 * Retrieve children of a menu item identified by a path.
 *
 * @param menuPath
 * @param menu
 */
export function getSubMenu(
  [head, ...tail]: string[],
  menu: readonly MenuItem[],
): readonly MenuItem[] {
  const current = expectSingle(menu.filter((item) => item.slug === head));

  if (tail.length > 0) {
    return getSubMenu(tail, current.children);
  }
  return current.children;
}
