import { MenuItemConfig } from './MenuItemConfig';

export type BuildOptions = {
  templateDirectories?: readonly string[];
  menu?: readonly MenuItemConfig[];
  globals?: Record<string, unknown>;
};
