const logger = require('../logger');
const createServer = require('../server');

function serve(argv, options) {
  const app = createServer(options.outputDirectory);
  app.listen(options.port);
  logger.verbose(`Listening on port ${options.port}`);
}

serve.daemonize = true;

module.exports = serve;
