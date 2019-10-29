import { AuthorConfig } from './AuthorConfig';
import { MenuItemConfig } from './MenuItemConfig';

/**
 * Options used to create the main `build` function.
 */
export type BuildOptions = {
  authors?: readonly AuthorConfig[];
  templateDirectories?: readonly string[];
  menu?: readonly MenuItemConfig[];
  globals?: Record<string, unknown>;
};
