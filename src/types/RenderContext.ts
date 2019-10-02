import { Breadcrumb } from './Breadcrumb';

export const RenderContextKey = Symbol('RenderContextKey');

export type RenderContext = {
  activePath: Breadcrumb[];
};
