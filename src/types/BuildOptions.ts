import { AuthorConfig } from './AuthorConfig';
import { MenuItemConfig } from './MenuItemConfig';
import { PreprocessorFn } from './PreprocessorFn';
import { RenderHookFn } from './RenderHookFn';

/**
 * Options used to create the main `build` function.
 */
export type BuildOptions = {
  authors?: readonly AuthorConfig[];
  templateDirectories?: readonly string[];
  menu?: readonly MenuItemConfig[];
  globals?: Record<string, unknown>;
  preprocessors?: readonly PreprocessorFn[];
  strings?: Array<Record<string, Record<string, string>>>;
  outputDirectory?: string;
  renderHooks?: RenderHookFn[];
};
