const _ = require('lodash');

/** Base class for site structure nodes. */
class Node {
  constructor(parent, site) {
    if (new.target === Node) {
      throw new TypeError('Can\'t initialize Node instances directly.');
    }

    this.parent = parent;
    this.attributes = {};
    this.children = [];
    this._site = site;

    if (this.parent) {
      this.parent.addChild(this);
    }
  }

  get path() {
    let path = [];
    if (this.parent) {
      path = this.parent.path;
    }

    if (this.attributes.name) {
      path.push(this.attributes.name);
    }

    return path;
  }

  get breadcrumbs() {
    let result = [];
    if (this.parent) {
      result = this.parent.breadcrumbs;
    }

    if (!this.getOwn('menuTitle') || this.basename === 'index.html') {
      return result;
    }

    result.push(this);

    return result;
  }

  get uri() {
    let path = _.cloneDeep(this.path);
    if (this.path.slice(-1) === 'index.html') {
      path = path.slice(0, -1);
    }
    return `/${path.join('/')}`;
  }

  get vars() {
    let vars = {};
    if (this.parent) {
      vars = this.parent.vars;
    }

    if (this.attributes.vars) {
      _.merge(vars, this.attributes.vars);
    }

    return vars;
  }

  get url() {
    const { path } = this;

    if (this.isFile) {
      const filenameParts = path[path.length - 1].split('.');
      const ext = filenameParts[filenameParts.length - 1];

      if (ext === 'html') {
        if (path.slice(-1)[0] === 'index.html') {
          delete path[path.length - 1];
        } else {
          path[path.length - 1] = filenameParts.slice(0, filenameParts.length - 1);
        }
      }
    }

    const baseUrl = this.get('baseUrl');
    if (baseUrl) {
      path.unshift(baseUrl);
    }

    // Remove trailing slash
    const pathString = path.join('/');
    if (pathString.slice(-1) === '/') {
      return pathString.slice(0, -1);
    }
    return pathString;
  }

  get basename() {
    return this.path.slice(-1)[0];
  }

  get extension() {
    const basenameParts = this.basename.split('.');
    if (basenameParts.length < 2) {
      return '';
    }
    return `.${basenameParts.slice(-1)}`;
  }

  get isFile() {
    return (('type' in this.attributes) && this.attributes.type !== 'directory');
  }

  get isDirectory() {
    return (('type' in this.attributes) && this.attributes.type === 'directory');
  }

  get site() {
    if (this._site) {
      return this._site;
    }
    if (this.parent) {
      return this.parent.site;
    }
    return null;
  }

  addChild(child) {
    if (!(child instanceof Node)) {
      throw new Error('Child must be an instance of Node');
    }
    this.children.push(child);
  }

  updateAttributes(updates) {
    this.attributes = _.merge(this.attributes, updates);
  }

  getOwn(key, fallback = undefined) {
    if (this.attributes.vars && (key in this.attributes.vars)) {
      return this.attributes.vars[key];
    }
    return fallback;
  }

  get(key, fallback = undefined) {
    if (this.attributes.vars && (key in this.attributes.vars)) {
      return this.attributes.vars[key];
    } else if (this.parent) {
      return this.parent.get(key, fallback);
    }
    return fallback;
  }

  set(key, value) {
    if (!this.attributes.vars) {
      this.attributes.vars = {};
    }
    this.attributes.vars[key] = value;
  }
}

module.exports = Node;
