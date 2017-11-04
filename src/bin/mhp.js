#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const winston = require('winston');
const Site = require('../lib/site.js');
const { commands } = require('../lib/cli');

process.on('unhandledRejection', (reason) => {
  winston.error(reason);
});

const argv = minimist(process.argv.slice(2));

const options = {
  inputDirectory: argv.directory || process.cwd(),
};
options.outputDirectory = path.join(options.inputDirectory, 'dist');
options.port = argv.port || 8080;

if (argv.verbose) {
  winston.level = 'verbose';
} else {
  winston.level = 'info';
}

const command = argv._[0] || 'generate';
const commandFunction = commands[command];
if (!commandFunction) {
  throw new Error(`Unrecognized command ${command}`);
}

let promise;

if (commandFunction.initializeSite === false) {
  promise = commandFunction(argv, options);
} else {
  promise = Site.initialize(options.inputDirectory)
    .then(site => commandFunction(argv, options, site));
}

if (commandFunction.daemonize !== true)
{
  promise.then(() => {
    process.exit(0);
  });
}
