import { AuthorConfig } from '../../types/AuthorConfig';
import { Plugin } from '../../types/BuildOptions';
import { Middleware } from '../../types/Middleware';
import { MenuItemConfig } from '../../types/MenuItemConfig';

/**
 * Type of the object exported by an mhprc file.
 */
export type SiteOptions = {
  authors?: readonly AuthorConfig[];
  templateDirectories?: readonly string[];
  menu?: readonly MenuItemConfig[];
  routes?: readonly Middleware[];
  strings?: Array<Record<string, Record<string, string>>>;
  plugins?: Plugin[];
};
