#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const logger = require('../lib/logger');
const Site = require('../lib/site');
const { commands } = require('../lib/cli');

process.on('unhandledRejection', (reason) => {
  if (reason.stack) {
    logger.error(reason.stack);
  } else {
    logger.error(reason);
  }
  process.exit(1);
});

(async () => {
  const argv = minimist(process.argv.slice(2));

  const inputDirectory = argv.directory || process.cwd();

  const options = {
    inputDirectory,
    outputDirectory: path.join(inputDirectory, 'dist'),
    port: argv.port || 8080,
    baseUrl: argv.baseUrl || false,
    keep: [],
    cleanUnknownFiles: !argv.noclean,
    timezone: argv.tz,
  };

  if (argv.keep) {
    if (Array.isArray(argv.keep)) {
      options.keep = argv.keep;
    } else {
      options.keep.push(argv.keep);
    }
  }

  if (argv.verbose) {
    logger.level = 'verbose';
  } else {
    logger.level = 'info';
  }

  const command = argv._[0] || 'build';
  const commandFunction = commands[command];
  if (!commandFunction) {
    throw new Error(`Unrecognized command ${command}`);
  }

  let promise;

  if (commandFunction.initializeSite === false) {
    promise = commandFunction(argv, options);
  } else {
    const site = await Site.initialize(
      options.inputDirectory,
      options.outputDirectory,
    );
    promise = commandFunction(argv, options, site);
  }

  if (commandFunction.daemonize !== true) {
    await promise;
    process.exit(0);
  }
})();
