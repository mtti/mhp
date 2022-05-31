import { Post } from '../Post';
import { AuthorConfig } from './AuthorConfig';
import { MenuItemConfig } from './MenuItemConfig';
import { RenderOptions } from './RenderOptions';

/**
 * Options used to create the main `build` function.
 */
export type BuildOptions = {
  assetManifest?: string;

  authors: readonly AuthorConfig[];

  templateDirectories: readonly string[];

  menu: readonly MenuItemConfig[];

  globals: Record<string, unknown>;

  // eslint-disable-next-line no-use-before-define
  plugins: readonly Plugin[];

  strings: Array<Record<string, Record<string, string>>>;

  outputDirectory: string;
};

export interface Plugin {
  /**
   * Called during initialization to allow plugins to modify the global build
   * options.
   */
  onInitialize?: (options: BuildOptions) => BuildOptions;

  /**
   * Called on each post after it's loaded.
   */
  onPreprocessPost?: (post: Post) => Promise<Post>;

  /**
   * Called before rendering a page.
   */
  onPreRender?: (options: RenderOptions) => RenderOptions;

  /**
   * Called after a file has been rendered.
   */
  onPostRender?: (options: RenderOptions, rendered: string) => string;
}
