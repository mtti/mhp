import { MenuItem } from '../types/MenuItem';
import { MenuItemConfig } from '../types/MenuItemConfig';

export const resolveMenu = (
  config: readonly MenuItemConfig[],
  uri: readonly string[] = [],
): MenuItem[] => config.map((item): MenuItem => {
  const itemUri = [...uri, item.slug];
  return {
    slug: item.slug,
    title: item.title || item.slug,
    uri: itemUri,
    children: item.children ? resolveMenu(item.children, itemUri) : [],
  };
});
