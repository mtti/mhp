const fs = require('fs');
const path = require('path');
const { cleanUnknownFiles } = require('../utils');
const { Router } = require('../router');

/**
 * Handles the "build" CLI command which builds an MHP site at the current working directory.
 * @param {string[]} argv
 * @param {Object} options
 * @param {*} site
 */
function build(argv, options, site) {
  const router = new Router({
    siteTitle: 'An MHP Site',
    baseUrl: options.baseUrl || 'http://127.0.0.1',
    globals: {
      assetManifest: site.assetManifest,
    },
  });
  router.initialize(site, null, '');

  if (site.routeCb) {
    site.routeCb(router);

    const siteTemplates = path.join(site.baseDirectory, 'templates');
    if (fs.existsSync(siteTemplates)) {
      site.addTemplateDirectory(siteTemplates);
    }

    router.execute();
  }

  if (options.cleanUnknownFiles !== false) {
    const extraKnownFiles = options.keep.map(
      filename => path.join(site.outputDirectory, filename),
    );
    const knownFiles = [
      ...site.generatedFiles,
      ...extraKnownFiles,
    ];
    cleanUnknownFiles(site.outputDirectory, knownFiles);
  }
}

module.exports = build;
