const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const Node = require('./node');
const FileNode = require('./file-node');
const generators = require('../generators');

const { cleanAttributes, guessMimeType } = require('../utils');

/** Represents a directory in the site structure.  */
class DirectoryNode extends Node {
  static fromFile(filePath, site) {
    const doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    return new DirectoryNode(null, doc, site);
  }

  /**
   * Parse generator configurations from options file format to the internal format.
   * @param {*} generatorConfig
   */
  static _parseGenerators(generatorConfig) {
    if (!generatorConfig) {
      return [];
    }

    if (generatorConfig instanceof Array) {
      return generatorConfig.map((item) => {
        if (typeof item === 'object') {
          return item;
        } else if (typeof item === 'string') {
          return { generator: item };
        }
        throw new Error('Invalid generator configuration');
      });
    } else if (typeof generatorConfig === 'object') {
      return _.reduce(generatorConfig, (result, value, key) => {
        const item = _.cloneDeep(value);
        item.generator = key;
        result.push(item);
        return result;
      }, []);
    } else if (typeof generatorConfig === 'string') {
      return [{ generator: generatorConfig }];
    }

    throw new Error(`Unsupported generator configuration type: ${typeof generatorConfig}`);
  }

  constructor(parent, options = {}, site) {
    super(parent, site);

    if (typeof options !== 'object') {
      throw new Error('Directory options must be an object');
    }

    this._posts = null;

    // In a directory config, keys starting with an underscore are attributes...
    this.attributes
      = cleanAttributes(_.fromPairs(_.toPairs(options).filter(pair => pair[0].startsWith('_'))));

    // ...and regular keys are names of children...
    const children = _.toPairs(options)
      .filter(pair => !pair[0].startsWith('_'))
      .map((pair) => {
        const item = _.cloneDeep(pair[1]);
        item._name = item._name || pair[0];
        item._type = item._type || guessMimeType(pair[0]);
        return item;
      });

    // ...which can be either files...
    this.files = _.fromPairs(children
      .filter(item => item._type !== 'directory')
      .map((item) => {
        const file = new FileNode(this, item);
        return [file.attributes.name, file];
      }));

    // ...or directories.
    this._subdirectories = children
      .filter(item => item._type === 'directory')
      .map(subdirectory => new DirectoryNode(this, subdirectory));

    this._generators = DirectoryNode._parseGenerators(this.attributes.generate);
  }

  get slice() {
    if (this._posts) {
      return this._posts;
    } else if (this.attributes.inheritPosts !== false && this.parent) {
      return this.parent.slice;
    } else if (this.site) {
      return this.site.postDb.slice();
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  get isDirectory() {
    return true;
  }

  addFile(options) {
    const file = new FileNode(this, options);
    this.files[file.attributes.name] = file;
    return file;
  }

  addSubdirectory(options) {
    const subdirectory = new DirectoryNode(this, options);
    this._subdirectories.push(subdirectory);
    return subdirectory;
  }

  /** Returns a subdirectory node by name, creating a new one if it doesn't already exist. */
  getOrCreateSubdirectory(name) {
    let subdirectory;

    const existing = this._subdirectories.filter(item => item.basename === name);
    if (existing.length > 0) {
      subdirectory = existing[0];
    } else {
      const options = {
        _name: name,
        _type: 'directory',
      };
      subdirectory = new DirectoryNode(this, options);
      this._subdirectories.push(subdirectory);
    }

    return subdirectory;
  }

  setPostFilter(filter) {
    this._posts = this.site.postDb.slice(filter);
  }

  runGenerators(filterCb) {
    this._generators.filter(filterCb)
      .forEach((options) => {
        generators[options.generator](this, options);
      });
  }

  /**
   * Execute a callback for this directory node and all subdirectories recursively.
   *
   * @param {*} callback
   */
  walk(callback) {
    callback(this);
    this._subdirectories.forEach(subdirectory => subdirectory.walk(callback));
  }
}

module.exports = DirectoryNode;
