import path from 'path';
import { emit } from './emit';
import { expectDirectory } from './utils';
import { loadPosts } from './loadPosts';
import { EmitFunc } from './types/EmitFunc';
import { Environment } from './types/Environment';
import { render } from './environment/render';
import { renderString } from './environment/renderString';
import { loadPage } from './environment/loadPage';
import { write } from './environment/write';
import { checkDirectory } from './utils/checkDirectory';
import { checkDirectories } from './utils/checkDirectories';
import { ensureDirectory } from './utils/ensureDirectory';
import { createNunjucksEnv } from './nunjucks/createNunjucksEnv';

export async function build(
  baseDirectory: string,
  main: (emit: EmitFunc) => Promise<void>,
): Promise<void> {
  const postsDirectory = await expectDirectory(baseDirectory, 'posts');
  const outputDirectory = await ensureDirectory(baseDirectory, 'dist');
  const pagesDirectory = await checkDirectory(baseDirectory, 'pages');

  const posts = await loadPosts(postsDirectory);

  const templateDirectories = await checkDirectories([
    path.resolve(__dirname, '..', 'templates'),
    path.join(baseDirectory, 'templates'),
  ]);
  const nunjucksEnv = createNunjucksEnv(templateDirectories);

  const env: Environment = {
    renderString: renderString(nunjucksEnv),
    render: render(nunjucksEnv),
    write: write(outputDirectory),
    loadPage: loadPage(pagesDirectory),
  };

  await main(emit(env, posts));
}
