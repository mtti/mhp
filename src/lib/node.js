const _ = require('lodash');

class Node {
  constructor(parent) {
    this.parent = parent;
    this.attributes = {};
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

    const menuTitle = this.getOwn('menuTitle');

    if (!menuTitle || this.basename === 'index.html') {
      return result;
    }

    result.push(this);
    return result;
  }

  get uri() {
    const path = this.path.join('/');
    return `/${path}`;
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

    return path.join('/');
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
