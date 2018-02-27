const _ = require('lodash');
const { cleanAttributes } = require('../utils');
const Node = require('./node');

/** Represents a file in the site structure. */
class FileNode extends Node {
  get template() {
    if (this.attributes.template) {
      return this.attributes.template;
    }

    if (this.vars.template) {
      return this.vars.template;
    }

    throw new Error('File has no template');
  }

  constructor(parent, attributes, site) {
    super(parent, site);
    this.attributes = cleanAttributes(_.clone(attributes));
  }
}

module.exports = FileNode;
