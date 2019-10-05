import { Middleware } from '../../types/Middleware';
import { MenuItemConfig } from '../../types/MenuItemConfig';

export type SiteOptions = {
  templateDirectories?: readonly string[];
  menu?: readonly MenuItemConfig[];
  routes?: readonly Middleware[];
};
