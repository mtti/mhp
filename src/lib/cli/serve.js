const winston = require('winston');
const createServer = require('../server');

function serve(argv, options, site) {
  const app = createServer(options.outputDirectory);
  app.listen(options.port);
  winston.verbose(`Listening on port ${options.port}`);
}

serve.daemonize = true;

module.exports = serve;
