const path = require('path');
const _ = require('lodash');
const fm = require('front-matter');
const fs = require('fs-extra');
const winston = require('winston');
const Post = require('./post');
const Slice = require('./slice');
const { asyncMap } = require('../utils');

class PostDb {
  static checkFileType(originalFile, cb) {
    const file = _.cloneDeep(originalFile);
    fs.stat(file.path, (err, stat) => {
      if (err !== null) {
        cb(err);
        return;
      }
      if (stat.isFile()) {
        file.type = 'file';
      } else if (stat.isDirectory()) {
        file.type = 'directory';
      }

      cb(null, file);
    });
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
          winston.warn(`Post ${filePath} ignored: ${validationErrors.join(',')}`);
        } else {
          this.posts.push(post);
        }

        return post;
      });
  }

  loadDirectory(directory) {
    return fs.readdir(directory)
      .then((filenames) => {
        const files = filenames.map((filename) => {
          const fullPath = path.join(directory, filename);
          const extension = path.extname(fullPath);
          return {
            path: fullPath,
            extension,
          };
        });
        return asyncMap(files, PostDb.checkFileType);
      })
      .then((items) => {
        const filePromises = items
          .filter(item => item.type === 'file' && item.extension === '.md')
          .map(file => this.load(file.path));
        const directoryPromises = items
          .filter(item => item.type === 'directory')
          .map(subdirectory => this.loadDirectory(subdirectory));
        return Promise.all(_.flattenDeep([filePromises, directoryPromises]));
      });
  }

  slice(filters, sorter) {
    return new Slice(this, filters, sorter);
  }

  execute() {
    return this.posts;
  }
}

module.exports = PostDb;
