const path = require('path');
const _ = require('lodash');
const fm = require('front-matter');
const fs = require('fs-extra');
const logger = require('../logger');
const Post = require('./post');
const Slice = require('./slice');
const { readDirectory } = require('../utils');

class PostDb {
  constructor() {
    this.posts = [];
  }

  async load(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    const content = fm(data);

    const fields = _.cloneDeep(content.attributes);
    fields.body = content.body;
    fields.contentType = 'text/markdown';
    const post = new Post(fields, {
      basename: path.basename(filePath, path.extname(filePath)),
      sourcePath: filePath,
    });

    const validationErrors = post.validate();
    if (validationErrors.length > 0) {
      logger.warn(`Post ${filePath} ignored: ${validationErrors.join(',')}`);
    } else {
      this.posts.push(post);
    }

    return post;
  }

  async loadDirectory(directory) {
    const items = await readDirectory(directory);
    const filePromises = items
      .filter(item => item.stat.isFile() && item.extension === '.md')
      .map(file => this.load(file.path));
    const subdirPromises = items
      .filter(item => item.stat.isDirectory())
      .map(subdirectory => this.loadDirectory(subdirectory.path));
    await Promise.all([...filePromises, ...subdirPromises]);
  }

  slice(filters, sorter) {
    return new Slice(this, filters, sorter);
  }

  findAll() {
    return this.posts;
  }
}

module.exports = PostDb;
