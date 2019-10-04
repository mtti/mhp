import { MenuItem } from '../types/MenuItem';

export function resolveActivePath(
  breadcrumbs: readonly MenuItem[],
  [head, ...tail]: readonly string[],
): MenuItem[] {
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
