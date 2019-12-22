import { MenuItem } from '../types/MenuItem';
import { MenuItemConfig } from '../types/MenuItemConfig';
import { splitUri } from './splitUri';

/**
 * Constructs `MenuItem`s from `MenuItemConfig`s.
 *
 * @param config
 * @param uri
 */
export const resolveMenu = (
  config: readonly MenuItemConfig[],
  uri: readonly string[] = [],
): MenuItem[] => config.map((item): MenuItem => {
  if (item.uri && item.slug) {
    throw new Error(`Menu item ${item.slug} has both a slug and an URI. Only one is allowed.`);
  }

  let itemUri: string[];
  if (item.uri) {
    itemUri = splitUri(item.uri);
  } else if (item.slug) {
    itemUri = [...uri, item.slug];
  } else {
    throw new Error('Menu item must have either a slug or an URI');
  }

  return {
    slug: item.slug,
    title: item.title || item.slug || '',
    uri: itemUri,
    children: item.children ? resolveMenu(item.children, itemUri) : [],
    attributes: item.attributes || {},
  };
});
