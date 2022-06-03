import path from 'path';
import { fromEntries } from '@mtti/funcs';
import { ExpandDatePlugin } from './plugins';
import { loadPosts } from './loadPosts';
import { Environment } from './types/Environment';
import { render } from './environment/render';
import { renderString } from './environment/renderString';
import { loadPage } from './environment/loadPage';
import { write } from './environment/write';
import { Middleware } from './types/Middleware';
import { BuildContext } from './types/BuildContext';
import { BuildFn } from './types/BuildFn';
import { BuildOptions } from './types/BuildOptions';
import { checkDirectory } from './utils/checkDirectory';
import { checkDirectories } from './utils/checkDirectories';
import { ensureDirectory } from './utils/ensureDirectory';
import { createNunjucksEnv } from './nunjucks/createNunjucksEnv';
import { tryReadJson } from './utils/tryReadJson';
import { expectStringDictionary } from './utils/expectStringDictionary';
import { compose } from './middleware/compose';
import { resolveMenu } from './utils/resolveMenu';
import { preprocessPosts } from './utils/preprocessPosts';
import { mergeTranslations } from './utils/mergeTranslations';

export function build(
  baseDirectory: string,
  options?: Partial<BuildOptions>,
): BuildFn {
  let opts: BuildOptions = {
    globals: {},
    authors: [],
    templateDirectories: [],
    menu: [],
    strings: [],
    outputDirectory: path.join(baseDirectory, 'dist'),
    plugins: [],
    ...(options || {}),
  };

  opts.plugins = [
    new ExpandDatePlugin('publishedAt'),
    ...opts.plugins,
  ];

  for (const plugin of opts.plugins) {
    if (plugin.onInitialize) {
      opts = plugin.onInitialize(opts);
    }
  }

  const menu = resolveMenu(opts.menu || []);

  return async (...middleware: Middleware[]): Promise<void> => {
    // Look up directories
    const postsDirectory = await checkDirectory(baseDirectory, 'posts');
    const outputDirectory = await ensureDirectory(opts.outputDirectory);
    const pagesDirectory = await checkDirectory(baseDirectory, 'pages');

    // Create nunjucks environment
    const templateDirectories = await checkDirectories([
      path.resolve(__dirname, '..', 'templates'),
      ...(opts.templateDirectories || []),
      path.join(baseDirectory, 'templates'),
    ]);
    const nunjucksEnv = createNunjucksEnv(templateDirectories);

    // Log written files
    const writeCallback = (file: string): void => {
      // eslint-disable-next-line no-console
      console.log(`Writing: ${file}`);
    };

    // Load asset manifest if it exists
    const assetManifestPath = opts.assetManifest || path.join(
      outputDirectory,
      '.manifest.json',
    );
    const assetManifest = expectStringDictionary(
      await tryReadJson(assetManifestPath),
    );

    const env: Environment = {
      renderString: renderString(nunjucksEnv),
      render: render(
        nunjucksEnv,
        menu,
        opts.plugins,
      ),
      write: write(outputDirectory, false, writeCallback),
      loadPage: loadPage(pagesDirectory),
      globals: opts.globals || {},
    };

    const authorMap = fromEntries(
      (opts.authors || []).map((author) => [author.id, author]),
    );

    // Load posts
    let posts = postsDirectory
      ? await loadPosts(env.renderString, postsDirectory) : [];
    posts = await preprocessPosts(posts, opts.plugins);

    const context: BuildContext = {
      authors: authorMap,
      uri: [],
      posts,
      vars: {
        assetManifest,
      },
      strings: mergeTranslations(opts.strings || []),
    };

    await compose(...middleware)(env, context);
  };
}
