import { expectUri } from '../../utils/expectUri';
import { getRenderContext } from '../../utils/getRenderContext';
import { isInActivePath as isInActivePathFn } from '../../utils/isInActivePath';
import { NunjucksContext } from '../NunjucksContext';

export function isInActivePath(
  this: NunjucksContext,
  uri: string|string[],
): boolean {
  const renderContext = getRenderContext(this.ctx);
  const checkedUri = expectUri(uri);

  return isInActivePathFn(checkedUri, renderContext.activePath);
}
