import { expectUri } from '../../utils/expectUri';
import { NunjucksContext } from '../NunjucksContext';
import { getRenderContext } from '../../utils/getRenderContext';
import { isInActivePath as isInActivePathFn } from '../../utils/isInActivePath';

export function isInActivePath(
  this: NunjucksContext,
  input: string|string[],
): boolean {
  const renderContext = getRenderContext(this);
  const uri = expectUri(input);

  return isInActivePathFn(uri, renderContext.activePath);
}
