import path from 'path';
import { fromEntries } from '@mtti/funcs';
import { loadPosts } from './loadPosts';
import { Environment } from './types/Environment';
import { render } from './environment/render';
import { renderString } from './environment/renderString';
import { loadPage } from './environment/loadPage';
import { write } from './environment/write';
import { checkDirectory } from './utils/checkDirectory';
import { checkDirectories } from './utils/checkDirectories';
import { ensureDirectory } from './utils/ensureDirectory';
import { createNunjucksEnv } from './nunjucks/createNunjucksEnv';
import { tryReadJson } from './utils/tryReadJson';
import { expectStringDictionary } from './utils/expectStringDictionary';
import { Middleware } from './types/Middleware';
import { BuildContext } from './types/BuildContext';
import { BuildFn } from './types/BuildFn';
import { BuildOptions } from './types/BuildOptions';
import { compose } from './middleware/compose';
import { resolveMenu } from './utils/resolveMenu';
import { preprocessPosts } from './utils/preprocessPosts';
import { extractDateComponents } from './preprocessors/extractDateComponents';
import { mergeTranslations } from './utils/mergeTranslations';
import { AuthorConfig } from './types/AuthorConfig';

export function build(baseDirectory: string, options?: BuildOptions): BuildFn {
  const opts = {
    globals: {},
    menu: [],
    authors: [] as readonly AuthorConfig[],
    preprocessors: [
      extractDateComponents('publishedAt'),
    ],
    strings: [],
    outputDirectory: path.join(baseDirectory, 'dist'),
    renderHooks: [],
    ...(options || {}),
  };

  const menu = resolveMenu(opts.menu || []);

  return async (...middleware: Middleware[]): Promise<void> => {
    // Look up directories
    const postsDirectory = await checkDirectory(baseDirectory, 'posts');
    const outputDirectory = await ensureDirectory(opts.outputDirectory);
    const pagesDirectory = await checkDirectory(baseDirectory, 'pages');

    // Load posts
    let posts = postsDirectory ? await loadPosts(postsDirectory) : [];
    posts = await preprocessPosts(posts, (opts.preprocessors || []));

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
        opts.renderHooks,
      ),
      write: write(outputDirectory, false, writeCallback),
      loadPage: loadPage(pagesDirectory),
      globals: opts.globals || {},
    };

    const authorMap = fromEntries(
      (opts.authors || []).map((author) => [author.id, author]),
    );

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
