import { RenderContext } from '../types/RenderContext';

/**
 * Get a RenderContext from a nunjucks context object.
 *
 * @param context
 */
export function getRenderContext(context: Record<string, any>): RenderContext {
  // eslint-disable-next-line no-underscore-dangle
  const renderContext = context._renderContext as RenderContext|undefined;
  if (!renderContext) {
    throw new Error('Expected render context');
  }
  return renderContext;
}
