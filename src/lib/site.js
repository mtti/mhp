const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const nunjucks = require('nunjucks');
const { PostDb } = require('./post');
const { DirectoryNode } = require('./nodes');
const templateFilters = require('./template-filters');

class Site {
  static initialize(baseDirectory, outputDirectory) {
    const site = new Site(baseDirectory, outputDirectory);
    return site.postDb.loadDirectory(path.join(baseDirectory, 'posts'))
      .then(() => site);
  }

  get outputDirectory() {
    return this._outputDirectory;
  }

  constructor(baseDirectory, outputDirectory) {
    this.baseDirectory = baseDirectory;
    this._outputDirectory = outputDirectory;
    this.root = DirectoryNode.fromFile(path.join(this.baseDirectory, 'mhp.yml'), this);
    this.nunjucks = nunjucks.configure(path.join(this.baseDirectory, 'templates'));
    this.postDb = new PostDb();

    _.toPairs(templateFilters).forEach((item) => {
      this.nunjucks.addFilter(item[0], item[1]);
    });

    const functionsModulePath = path.join(this.baseDirectory, 'mhp.functions.js');
    if (fs.existsSync(functionsModulePath)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      this.functions = require(path.join(this.baseDirectory, 'mhp.functions.js'));
    } else {
      this.functions = {};
    }

    const routesModulePath = path.join(this.baseDirectory, 'mhp.routes.js');
    if (fs.existsSync(routesModulePath)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      this.routeCb = require(routesModulePath);
    } else {
      this.routeCb = null;
    }
  }
}

module.exports = Site;
