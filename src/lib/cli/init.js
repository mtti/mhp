const path = require('path');
const fs = require('fs-extra');

function init(argv, options) {
  const directory = options.inputDirectory;
  const base = path.join(__dirname, '..', '..', '..', 'base');

  fs.copySync(base, directory, {
    overwrite: argv.overwrite,
  });

  return Promise.resolve();
}

init.initializeSite = false;

module.exports = init;
