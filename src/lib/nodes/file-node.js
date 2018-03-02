const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const fm = require('front-matter');
const winston = require('winston');
const nunjucks = require('nunjucks');
const marked = require('marked');
const { cleanAttributes, replaceExtension } = require('../utils');
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

  /**
   * Create a FileNode
   * @param {Node} parent
   * @param {*} attributes
   * @param {Site} site
   */
  constructor(parent, attributes, site) {
    super(parent, site);
    this.attributes = cleanAttributes(_.clone(attributes));

    this._controller = null;
    this._page = null;

    if (this.attributes.controller) {
      if (!(this.attributes.controller in this.site.functions)) {
        throw new Error(`Controller does not exist: ${this.attributes.controller}`);
      }
      this._controller = this.site.functions[this.attributes.controller];
    }

    this._load();
  }

  /**
   * Render the file.
   * @returns {string} Rendered file content.
   */
  render() {
    let vars;
    if (this._controller) {
      vars = this._controller(this);
    } else {
      vars = _.cloneDeep(this.vars);
    }

    vars.breadcrumbs = this.breadcrumbs.map((node) => ({
      node,
      current: node.url == this.url,
      title: node.get('menuTitle'),
      url: node.url,
    }));

    let { content } = this.attributes;
    if (!content) {
      if (this._page) {
        vars.content = new nunjucks.runtime.SafeString(marked(this._page.body));
      }
      content = this.site.nunjucks.render(this.template, vars);
    }
    if (content === null) {
      throw new Error(`nunjucks render returned null during ${this.uri}`);
    }

    return content;
  }

  /** Load additional configuration from disk. */
  _load() {
    if (this.attributes.page) {
      // Load page source file, merge in node attributes from front matter
      const contentPath = path.join(
        this.site.baseDirectory,
        'pages',
        replaceExtension(this.path.join(path.sep), 'md'),
      );
      if (fs.existsSync(contentPath)) {
        this._page = fm(fs.readFileSync(contentPath, 'utf8'));
        this.updateAttributes(this._page.attributes);
      }

      // Load optional controller file from same directory as source file
      const baseName = path.basename(contentPath).split('.')[0];
      const controllerPath = path.join(
        path.dirname(contentPath),
        `${baseName}.controller.js`,
      );
      if (fs.existsSync(controllerPath)) {
        winston.verbose(`Using controller ${controllerPath}`);
        // eslint-disable-next-line global-require, import/no-dynamic-require
        this._controller = require(controllerPath);
      }
    }
  }
}

module.exports = FileNode;
