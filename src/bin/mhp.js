#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const Site = require('../lib/site.js');
const { commands } = require('../lib/cli');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const argv = minimist(process.argv.slice(2));

const options = {
  inputDirectory: argv.directory || process.cwd(),
};
options.outputDirectory = path.join(options.inputDirectory, 'dist');

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
    .then((site) => {
      return commandFunction(argv, options, site);
    });
}

promise.then(() => {
  process.exit(0);
});
