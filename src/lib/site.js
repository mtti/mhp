const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const nunjucks = require('nunjucks');
const { PostDb } = require('./post');
const templateFilters = require('./template-filters');

class Site {
  static initialize(baseDirectory, outputDirectory) {
    const site = new Site(baseDirectory, outputDirectory);

    const postsDirectory = path.join(baseDirectory, 'posts');
    if (fs.existsSync(postsDirectory)) {
      return site.postDb.loadDirectory(postsDirectory)
        .then(() => site);
    }

    return Promise.resolve(site);
  }

  get outputDirectory() {
    return this._outputDirectory;
  }

  get assetManifest() {
    const assetManifestPath = path.join(this._outputDirectory, 'assets', 'manifest.json');
    if (fs.existsSync(assetManifestPath)) {
      return JSON.parse(fs.readFileSync(assetManifestPath));
    } else {
      return {};
    }
  }

  constructor(baseDirectory, outputDirectory) {
    this.baseDirectory = baseDirectory;
    this._outputDirectory = outputDirectory;
    this._assetManifest = {};
    this.nunjucks = nunjucks.configure(path.join(this.baseDirectory, 'templates'));
    this.postDb = new PostDb();
    this.generatedFiles = [];

    _.toPairs(templateFilters).forEach((item) => {
      this.nunjucks.addFilter(item[0], item[1]);
    });

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
