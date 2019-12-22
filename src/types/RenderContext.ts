import { MenuItem } from './MenuItem';

export const RenderContextKey = Symbol('RenderContextKey');

export type RenderContext = {
  activePath: MenuItem[];
};
