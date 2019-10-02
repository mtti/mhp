import { Breadcrumb } from '../types/Breadcrumb';

/**
 * Check if an URI path is in an active breadcrumb path.
 *
 * @param activePath
 * @param uri
 */
export function isInActivePath(
  uri: string[],
  activePath: Breadcrumb[],
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
