import { MenuItemConfig } from './MenuItemConfig';

export const RenderContextKey = Symbol('RenderContextKey');

export type RenderContext = {
  activePath: MenuItemConfig[];
};
