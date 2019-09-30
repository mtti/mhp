import path from 'path';
import { DateTime } from 'luxon';
import fs from 'fs-extra';
import minimist from 'minimist';
import slugify from 'slugify';
import sanitizeFilename from 'sanitize-filename';
import uuid4 from 'uuid/v4';
import YAML from 'yaml';
import { ensureDirectory } from '../../utils/ensureDirectory';
import { fileExists } from '../../utils/fileExists';

export async function createPost(
  baseDirectory: string,
  args: minimist.ParsedArgs,
): Promise<void> {
  let prefix: string;
  let title: string;

  if (args._.length === 1) {
    prefix = '';
    [title] = args._;
  } else if (args._.length === 2) {
    [prefix, title] = args._;
  } else {
    throw new Error('Usage: mhp create-post [PATH] TITLE');
  }

  const slug = slugify(title, { lower: true });
  const filename = `${sanitizeFilename(slug)}.md`;
  const directory = prefix ? path.join(baseDirectory, 'posts', prefix)
    : path.join(baseDirectory, 'posts');
  const fullPath = path.join(directory, filename);

  if (await fileExists(fullPath)) {
    throw new Error(`File already exists: ${fullPath}`);
  }

  await ensureDirectory(directory);

  const frontMatter = YAML.stringify({
    uuid: uuid4(),
    title,
    slug,
    publishedAt: DateTime.utc().toISO(),
  });

  const post = `---
${frontMatter}---

Write your post here.
`;

  // eslint-disable-next-line no-console
  console.log(`Writing: ${fullPath}`);
  await fs.writeFile(fullPath, post);
}
