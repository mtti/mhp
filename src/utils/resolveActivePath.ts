import { MenuItemConfig } from '../types/MenuItemConfig';

export function resolveActivePath(
  breadcrumbs: readonly MenuItemConfig[],
  [head, ...tail]: readonly string[],
): MenuItemConfig[] {
  const current = breadcrumbs
    .filter((crumb) => crumb.slug && crumb.slug === head)[0];

  if (!current) {
    return [];
  }

  return [
    current,
    ...resolveActivePath(current.children || [], tail),
  ];
}
