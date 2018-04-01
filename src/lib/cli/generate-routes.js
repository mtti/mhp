const { Router } = require('../router');

function generateRoutes(argv, options, site) {
  const router = new Router(site);

  if (site.routeCb) {
    site.routeCb(router);
  }
}

module.exports = generateRoutes;
