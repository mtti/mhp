#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const moment = require('moment-timezone');
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

options.keep = []
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
  winston.level = 'verbose';
} else {
  winston.level = 'info';
}

if (argv.tz) {
  options.timezone = argv.tz;
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
    .then((site) => {
      if (options.timezone) {
        site.root.set('timezone', options.timezone);
      }

      if (!site.root.get('timezone')) {
        site.root.set('timezone', moment.tz.guess());
      }

      if (argv.localhost) {
        let baseUrl = 'http://localhost';
        if (options.port != 80)
        {
          baseUrl = `${baseUrl}:${options.port}`;
        }
        site.root.set('baseUrl', baseUrl);
      }
      return site;
    })
    .then(site => commandFunction(argv, options, site));
}

if (commandFunction.daemonize !== true)
{
  promise.then(() => {
    process.exit(0);
  });
}
