import { MenuItem } from '../types/MenuItem';

/**
 * Check if an URI path is in an active breadcrumb path.
 *
 * @param activePath
 * @param uri
 */
export function isInActivePath(
  uri: string[],
  activePath: MenuItem[],
): boolean {
  const [crumbHead, ...crumbTail] = activePath;
  const [uriHead, ...uriTail] = uri;

  if (!crumbHead) {
    return !uriHead;
  }

  if (!uriHead) {
    return !!crumbHead;
  }

  if (uriHead !== crumbHead.slug) {
    return false;
  }

  return isInActivePath(uriTail, crumbTail);
}
