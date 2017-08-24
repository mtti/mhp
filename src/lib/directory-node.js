/* eslint-disable no-underscore-dangle */

const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const mime = require('mime-types');
const Node = require('./node');
const FileNode = require('./file-node');

const { cleanAttributes } = require('./utils.js');

function guessType(filename) {
  if (filename.split('.').length === 1) {
    return 'directory';
  }
  return mime.lookup(filename) || 'application/octet-stream';
}

class DirectoryNode extends Node {
  static fromFile(filePath) {
    const doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    return new DirectoryNode(null, doc);
  }

  constructor(parent, options = {}) {
    super(parent);

    if (typeof options !== 'object') {
      throw new Error('Directory options must be an object');
    }

    this.attributes = cleanAttributes(
      _.fromPairs(_.toPairs(options).filter(pair => pair[0].startsWith('_'))));

    const children = _.toPairs(options)
      .filter(pair => !pair[0].startsWith('_'))
      .map((pair) => {
        const item = _.cloneDeep(pair[1]);
        item._name = item._name || pair[0];
        item._type = item._type || guessType(pair[0]);
        return item;
      });

    this.files = {};
    children.filter(item => item._type !== 'directory')
      .forEach((item) => {
        const file = new FileNode(this, item);
        this.files[file.attributes.name] = file;
      });

    this.subdirectories = children.filter(item => item._type === 'directory')
      .map(subdirectory => new DirectoryNode(this, subdirectory));
  }

  get generators() {
    if (!this.attributes.generate) {
      return [];
    }

    if (this.attributes.generate instanceof Array) {
      return this.attributes.generate.map((item) => {
        if (typeof item === 'object') {
          return item;
        } else if (typeof item === 'string') {
          return { generator: item };
        }
        throw new Error('Invalid generator configuration');
      });
    } else if (typeof this.attributes.generate === 'object') {
      return _.reduce(this.attributes.generate, (result, value, key) => {
        const item = _.cloneDeep(value);
        item.generator = key;
        result.push(item);
        return result;
      }, []);
    } else if (typeof this.attributes.generate === 'string') {
      return [{ generator: this.attributes.generate }];
    }

    throw new Error(`Unsupported generator configuration type: ${typeof filter}`);
  }

  get posts() {
    if (this.slice) {
      return this.slice.execute();
    }
    return [];
  }

  addFile(options) {
    const file = new FileNode(this, options);
    this.files[file.attributes.name] = file;
    return file;
  }

  /**
   * Execute a callback for this directory node and all subdirectories recursively.
   *
   * @param {*} callback
   */
  walk(callback) {
    callback(this);
    this.subdirectories.forEach(subdirectory => subdirectory.walk(callback));
  }
}

module.exports = DirectoryNode;
