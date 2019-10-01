import { Middleware } from '../../types/Middleware';

export type SiteOptions = {
  templateDirectories?: string[];
  routes?: Middleware[];
};
