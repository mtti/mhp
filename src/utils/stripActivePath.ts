import { MenuItem } from '../types/MenuItem';

export function stripActivePath(
  [pathHead, ...pathTail]: readonly string[],
  [crumbHead, ...crumbTail]: readonly MenuItem[],
): MenuItem[] {
  if (pathTail.length === 0) {
    return crumbTail;
  }

  /*
  if (pathHead !== crumbHead.slug) {
    return crumbTail;
  }
  */

  return stripActivePath(pathTail, crumbTail);
}
