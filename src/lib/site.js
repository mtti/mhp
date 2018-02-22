const path = require('path');
const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const PostDB = require('./post-db');
const DirectoryNode = require('./directory-node.js');

class Site {
  static initialize(baseDirectory) {
    const site = new Site(baseDirectory);
    return site.postDb.loadDirectory(path.join(baseDirectory, 'posts'))
      .then(() => site);
  }

  constructor(baseDirectory) {
    this.baseDirectory = baseDirectory;
    this.root = DirectoryNode.fromFile(path.join(this.baseDirectory, 'mhp.yml'));
    this.nunjucks = nunjucks.configure(path.join(this.baseDirectory, 'templates'));
    this.postDb = new PostDB();

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
