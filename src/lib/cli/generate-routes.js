const path = require('path');
const { cleanUnknownFiles } = require('../utils');
const { Router } = require('../router');

function generateRoutes(argv, options, site) {
  const router = new Router({
    baseUrl: options.baseUrl,
    globals: {
      assetManifest: site.assetManifest,
    },
  });
  router.initialize(site, null, '');

  if (site.routeCb) {
    site.routeCb(router);
    site.addTemplateDirectory(path.join(site.baseDirectory, 'templates'));
    router.execute();
  }

  if (options.cleanUnknownFiles !== false) {
    const knownFiles = site.generatedFiles.slice();
    const extraKnownFiles = options.keep.map(filename => path.join(site.outputDirectory, filename));
    knownFiles.push(...extraKnownFiles);
    cleanUnknownFiles(site.outputDirectory, knownFiles);
  }
}

module.exports = generateRoutes;
