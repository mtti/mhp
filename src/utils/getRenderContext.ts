import { RenderContext, RenderContextKey } from '../types/RenderContext';

/**
 * Get a RenderContext from a nunjucks context object.
 *
 * @param context
 */
export function getRenderContext(context: any): RenderContext {
  const renderContext = context[RenderContextKey] as RenderContext|undefined;
  if (!renderContext) {
    throw new Error('Expected render context');
  }
  return renderContext;
}
