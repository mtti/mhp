import { Middleware } from '../../types/Middleware';
import { MenuItem } from '../../types/MenuItem';

export type SiteOptions = {
  templateDirectories?: readonly string[];
  menu?: readonly MenuItem[];
  routes?: readonly Middleware[];
};
