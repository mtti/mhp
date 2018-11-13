const path = require('path');
const os = require('os');
const _ = require('lodash');
const fs = require('fs-extra');
const loremIpsum = require('lorem-ipsum');
const uuidv4 = require('uuid/v4');
const slugify = require('slugify');
const sanitizeFilename = require('sanitize-filename');
const moment = require('moment');
const yaml = require('js-yaml');
const logger = require('../logger');

function _generatePost(targetDirectory, since, fields) {
  const sinceSeconds = Math.floor(Math.random() * moment.utc().diff(since, 'seconds'));
  const paragraphCount = Math.floor(Math.random() * 7) + 1;

  const vars = Object.assign({}, fields, {
    uuid: uuidv4(),
    title: loremIpsum({
      count: 1, units: 'sentences', sentenceLowerBound: 4, sentenceUpperBound: 6,
    }),
    publishedAt: moment().utc().subtract(sinceSeconds, 'seconds').format('YYYY-MM-DD HH:mmZ'),
  });
  const frontMatter = yaml.safeDump(vars);
  const body = loremIpsum({ count: paragraphCount, units: 'paragraphs' });

  const fileBody = `---${os.EOL}${frontMatter}---${os.EOL}${os.EOL}${body}`;
  const filename = sanitizeFilename(slugify(vars.title, { lower: true }));
  const filePath = path.join(targetDirectory, `${filename}.md`);

  fs.ensureDirSync(targetDirectory);
  fs.writeFileSync(filePath, fileBody, 'utf8');
  logger.info(`Wrote ${filePath}`);
}

function generatePosts(argv, options) {
  const since = argv.since || moment().utc().subtract(1, 'year');
  const count = argv.count || 100;

  let fields = argv.field || [];
  if (typeof (fields) === 'string') {
    fields = [fields];
  }
  fields = _.fromPairs(fields.map(pair => pair.split('=')));

  const pathParts = [options.inputDirectory, 'posts'];
  if (argv._.length > 1) {
    pathParts.push(...argv._[1].split('/'));
  }

  const targetDirectory = path.join(...pathParts);
  const sinceObj = moment(since);

  for (let i = 0; i < count; i += 1) {
    _generatePost(targetDirectory, sinceObj, fields);
  }
}

module.exports = generatePosts;
