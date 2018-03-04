const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const nunjucks = require('nunjucks');
const { PostDb } = require('./post');
const { DirectoryNode } = require('./nodes');
const templateFilters = require('./template-filters');

class Site {
  static initialize(baseDirectory) {
    const site = new Site(baseDirectory);
    return site.postDb.loadDirectory(path.join(baseDirectory, 'posts'))
      .then(() => site);
  }

  constructor(baseDirectory) {
    this.baseDirectory = baseDirectory;
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
  }
}

module.exports = Site;
