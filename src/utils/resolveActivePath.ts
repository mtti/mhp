import { Breadcrumb } from '../types/Breadcrumb';

export function resolveActivePath(
  breadcrumbs: readonly Breadcrumb[],
  [head, ...tail]: readonly string[],
): Breadcrumb[] {
  const current = breadcrumbs.filter((crumb) => crumb.slug === head)[0];

  if (!current) {
    return [];
  }

  return [
    current,
    ...resolveActivePath(current.children || [], tail),
  ];
}
