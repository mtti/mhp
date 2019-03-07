const path = require('path');
const _ = require('lodash');
const fm = require('front-matter');
const fs = require('fs-extra');
const logger = require('../logger');
const Post = require('./post');
const Slice = require('./slice');

class PostDb {
  static async _checkFileType(file) {
    const stat = await fs.stat(file.path);
    const fileCopy = { ...file };
    if (stat.isFile()) {
      fileCopy.type = 'file';
    } else if (stat.isDirectory()) {
      fileCopy.type = 'directory';
    }
    return fileCopy;
  }

  constructor() {
    this.posts = [];
  }

  load(filePath) {
    return fs.readFile(filePath, 'utf8')
      .then((data) => {
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
      });
  }

  loadDirectory(directory) {
    return fs.readdir(directory)
      .then(filenames => Promise.all(filenames
        .map(filename => ({
          path: path.join(directory, filename),
          extension: path.extname(filename),
        }))
        .map(file => PostDb._checkFileType(file))))
      .then((items) => {
        const filePromises = items
          .filter(item => item.type === 'file' && item.extension === '.md')
          .map(file => this.load(file.path));
        const directoryPromises = items
          .filter(item => item.type === 'directory')
          .map(subdirectory => this.loadDirectory(subdirectory.path));
        return Promise.all(_.flattenDeep([filePromises, directoryPromises]));
      });
  }

  slice(filters, sorter) {
    return new Slice(this, filters, sorter);
  }

  findAll() {
    return this.posts;
  }
}

module.exports = PostDb;
