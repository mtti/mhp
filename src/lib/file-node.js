
const _ = require('lodash');
const {cleanAttributes} = require('./utils.js');

class FileNode {
  get path() {
    var path = [];
    if (this.parent) {
      path = this.parent.path;
    }

    if (this.attributes.name) {
      path.push(this.attributes.name);
    }

    return path;
  }

  get vars() {
    var vars = {};
    if (this.parent) {
      vars = this.parent.vars;
    }

    if (this.attributes.vars) {
      _.merge(vars, this.attributes.vars);
    }

    return vars;
  }

  get template() {
    if (this.attributes.template) {
      return this.attributes.template;
    }

    const vars = this.vars;
    if (vars.template) {
      return vars.template;
    }

    throw new Error('File has no template');
  }

  constructor(parent, attributes) {
    this.parent = parent;
    this.attributes = cleanAttributes(_.clone(attributes));
  }
}

module.exports = FileNode;
