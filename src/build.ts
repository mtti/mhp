import nunjucks from 'nunjucks';
import { emit } from './emit';
import { expectDirectory } from './utils';
import { loadPosts } from './loadPosts';
import { EmitFunc } from './types/EmitFunc';
import { Environment } from './types/Environment';
import { render } from './environment/render';
import { renderString } from './environment/renderString';
import { write } from './environment/write';
import { ensureDirectory } from './utils/ensureDirectory';

export async function build(
  baseDirectory: string,
  main: (emit: EmitFunc) => Promise<void>,
): Promise<void> {
  const postsDirectory = await expectDirectory(baseDirectory, 'posts');
  const outputDirectory = await ensureDirectory(baseDirectory, 'dist');

  const posts = await loadPosts(postsDirectory);
  const nunjucksEnv = new nunjucks.Environment();

  const env: Environment = {
    renderString: renderString(nunjucksEnv),
    render: render(nunjucksEnv),
    write: write(outputDirectory),
  };

  await main(emit(env, posts));
}
