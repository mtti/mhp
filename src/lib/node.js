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

  get(key, fallback = undefined) {
    if (this.attributes.vars && (key in this.attributes.vars)) {
      return this.attributes.vars[key];
    } else if (this.parent) {
      return this.parent.var(key, fallback);
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
