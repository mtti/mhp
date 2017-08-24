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
}

module.exports = Node;
