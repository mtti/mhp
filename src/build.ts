import path from 'path';
import { emit } from './emit';
import { expectDirectory } from './utils';
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
import { MainArgs } from './types/MainArgs';
import { withVars } from './withVars';

export async function build(
  baseDirectory: string,
  main: (args: MainArgs) => Promise<void>,
): Promise<void> {
  // Look up directories
  const postsDirectory = await expectDirectory(baseDirectory, 'posts');
  const outputDirectory = await ensureDirectory(baseDirectory, 'dist');
  const pagesDirectory = await checkDirectory(baseDirectory, 'pages');

  // Load posts
  const posts = await loadPosts(postsDirectory);

  // Create nunjucks environment
  const templateDirectories = await checkDirectories([
    path.resolve(__dirname, '..', 'templates'),
    path.join(baseDirectory, 'templates'),
  ]);
  const nunjucksEnv = createNunjucksEnv(templateDirectories);

  // Log written files
  const writeCallback = (file: string): void => {
    console.log(`Writing: ${file}`);
  };

  // Load asset manifest if it exists
  const assetManifest = expectStringDictionary(await tryReadJson(path.join(
    outputDirectory,
    'assets',
    'manifest.json',
  )));

  const env: Environment = {
    renderString: renderString(nunjucksEnv),
    render: render(nunjucksEnv),
    write: write(outputDirectory, false, writeCallback),
    loadPage: loadPage(pagesDirectory),
  };

  await main({
    emit: emit(env, posts, assetManifest),
    withVars: withVars(env, posts, assetManifest),
  });
}
