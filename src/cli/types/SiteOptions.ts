import { Middleware } from '../../types/Middleware';
import { Breadcrumb } from '../../types/Breadcrumb';

export type SiteOptions = {
  templateDirectories?: readonly string[];
  breadcrumbs?: readonly Breadcrumb[];
  routes?: readonly Middleware[];
};
