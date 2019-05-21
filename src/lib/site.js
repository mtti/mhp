const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const nunjucks = require('nunjucks');
const { PostDb } = require('./post');
const templateFilters = require('./template-filters');
const Loader = require('./loader');

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

  get baseDirectory() {
    return this._baseDirectory;
  }

  get pageDirectory() {
    return path.join(this._baseDirectory, 'pages');
  }

  get assetManifest() {
    const assetManifestPath = path.join(this._outputDirectory, 'assets', 'manifest.json');
    if (fs.existsSync(assetManifestPath)) {
      return JSON.parse(fs.readFileSync(assetManifestPath));
    }
    return {};
  }

  constructor(baseDirectory, outputDirectory) {
    this._baseDirectory = baseDirectory;
    this._outputDirectory = outputDirectory;
    this._assetManifest = {};

    this._loader = new Loader();
    this._loader.addPath(path.join(__dirname, '..', '..', 'templates'));
    this.nunjucks = new nunjucks.Environment(this._loader);

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

  addTemplateDirectory(directoryPath) {
    this._loader.addPath(directoryPath);
  }
}

module.exports = Site;
