#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const logger = require('../lib/logger');
const Site = require('../lib/site.js');
const { commands } = require('../lib/cli');

process.on('unhandledRejection', (reason) => {
  logger.error(reason);
  console.log(reason);
});

const argv = minimist(process.argv.slice(2));

const options = {
  inputDirectory: argv.directory || process.cwd(),
};
options.outputDirectory = path.join(options.inputDirectory, 'dist');
options.port = argv.port || 8080;
options.baseUrl = argv.baseUrl || false;

options.keep = [];
if (argv.keep) {
  if (Array.isArray(argv.keep)) {
    options.keep = argv.keep;
  } else {
    options.keep.push(argv.keep);
  }
}

if (argv.noclean) {
  options.cleanUnknownFiles = false;
}

if (argv.verbose) {
  logger.level = 'verbose';
} else {
  logger.level = 'info';
}

if (argv.tz) {
  options.timezone = argv.tz;
}

const command = argv._[0] || 'generate-routes';
const commandFunction = commands[command];
if (!commandFunction) {
  throw new Error(`Unrecognized command ${command}`);
}

let promise;

if (commandFunction.initializeSite === false) {
  promise = commandFunction(argv, options);
} else {
  promise = Site.initialize(options.inputDirectory, options.outputDirectory)
    .then(site => commandFunction(argv, options, site));
}

if (commandFunction.daemonize !== true) {
  promise.then(() => {
    process.exit(0);
  });
}
