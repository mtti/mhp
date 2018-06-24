const path = require('path');
const fs = require('fs-extra');
const slugify = require('slugify');
const sanitizeFilename = require('sanitize-filename');
const nunjucks = require('nunjucks');
const winston = require('winston');
const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');

const postTemplate = `---
uuid: {{ uuid }}
title: {{ title }}
publishedAt: {{ publishedAt }}
---

Write your post here.
`;

function createPost(argv, options) {
  if (argv._.length !== 2) {
    throw new Error('Usage: mhp create-post TITLE');
  }

  const title = argv._[1];
  const slug = slugify(title, { lower: true });
  const sanitizedSlug = sanitizeFilename(slug);
  const filePath = path.join(options.inputDirectory, 'posts', `${sanitizedSlug}.md`);
  const publishedAt = moment().utc().format('YYYY-MM-DD HH:mmZ');

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
  fs.writeFileSync(filePath, body, 'utf8');
  winston.info(`Wrote ${filePath}`);
}

module.exports = createPost;
