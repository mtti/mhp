import { MenuItem } from '../types/MenuItem';

/**
 * Recursively remove invisible items from a menu.
 */
export const removeInvisibleMenuItems = (
  menu: readonly MenuItem[],
): readonly MenuItem[] => menu
  .filter((item) => item.visible)
  .map((item) => ({
    ...item,
    children: removeInvisibleMenuItems(item.children),
  }));
