const path = require('path');
const { cleanUnknownFiles } = require('../utils');
const { Router } = require('../router');

function generateRoutes(argv, options, site) {
  const router = new Router(site);

  if (site.routeCb) {
    site.routeCb(router);
  }

  if (options.cleanUnknownFiles !== false) {
    const knownFiles = site.generatedFiles.slice();
    const extraKnownFiles = options.keep.map(filename => path.join(site.outputDirectory, filename));
    knownFiles.push(...extraKnownFiles);
    cleanUnknownFiles(site.outputDirectory, knownFiles);
  }
}

module.exports = generateRoutes;
