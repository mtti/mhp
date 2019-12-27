import { MenuItem } from './MenuItem';

export type RenderContext = {
  activePath: MenuItem[];
  strings: Record<string, Record<string, string>>;
};
