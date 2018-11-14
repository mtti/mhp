const path = require('path');
const fs = require('fs-extra');
const slugify = require('slugify');
const sanitizeFilename = require('sanitize-filename');
const nunjucks = require('nunjucks');
const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');
const logger = require('../logger');

const postTemplate = `---
uuid: {{ uuid }}
title: {{ title }}
publishedAt: {{ publishedAt }}
---

Write your post here.
`;

/**
 * Handles the create-post CLI command which creates a new post with placeholder values in the MHP
 * site in the current working directory.
 * @param {string[]} argv
 * @param {Object} options
 */
function createPost(argv, options) {
  if (argv._.length !== 2) {
    throw new Error('Usage: mhp create-post TITLE');
  }

  const destParts = argv._[1].split('/');
  const title = destParts.slice(-1)[0];
  const slug = slugify(title, { lower: true });
  const sanitizedSlug = sanitizeFilename(slug);
  const publishedAt = moment().utc().format('YYYY-MM-DD HH:mmZ');

  const pathParts = [
    options.inputDirectory,
    'posts',
  ];
  if (pathParts.length > 1) {
    pathParts.push(...destParts.slice(0, -1));
  }
  const directoryPath = path.join(...pathParts);
  pathParts.push(`${sanitizedSlug}.md`);
  const filePath = path.join(...pathParts);

  if (fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} already exists`);
  }

  const vars = {
    uuid: uuidv4(),
    title,
    slug,
    publishedAt,
  };

  const body = nunjucks.compile(postTemplate).render(vars);

  fs.ensureDirSync(directoryPath);
  fs.writeFileSync(filePath, body, 'utf8');
  logger.info(`Wrote ${filePath}`);
}

module.exports = createPost;
