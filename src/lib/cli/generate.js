const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const winston = require('winston');

/**
 * Delete any files in outputDirectory that are not listed in knownFiles.
 * @param {*} outputDirectory
 * @param {*} knownFiles
 */
function cleanUnknownFiles(outputDirectory, knownFiles) {
  const known = _.fromPairs(knownFiles.map(filename => [filename, true]));

  function clean(directory) {
    const items = fs.readdirSync(directory)
      .map(filename => path.join(directory, filename))
      .filter(filePath => !(filePath in known))
      .map(filePath => ({ filePath, stats: fs.statSync(filePath) }));

    items
      .filter(item => item.stats.isFile())
      .forEach((item) => {
        winston.verbose(`Deleting ${item.filePath}`);
        fs.removeSync(item.filePath);
      });

    items
      .filter(item => item.stats.isDirectory())
      .forEach((item) => {
        clean(item.filePath);
      });

    if (fs.readdirSync(directory).length === 0) {
      winston.verbose(`Removing empty directory ${directory}`);
      fs.rmdirSync(directory);
    }
  }

  clean(outputDirectory);
}

function _generatePosts(site) {
  site.root.walk((directory) => {
    if (directory.attributes.filterPosts) {
      directory.setPostFilter(directory.attributes.filterPosts);
    } else if (directory.attributes.filterPostsWith) {
      directory.setPostFilter(site.functions[directory.attributes.filterPostsWith]);
    }
    directory.runGenerators(options => options.generator === 'posts');
  });
}

function _generateOthers(site) {
  site.root.walk((directory) => {
    directory.runGenerators(options => options.generator !== 'posts');
  });
}

function generate(argv, options, site) {
  // Generate only posts first so that canonical paths get set.
  _generatePosts(site);

  // After canonical paths have been set, run all other generators.
  _generateOthers(site);

  const generatedFiles = [];

  site.root.walk((directory) => {
    const directoryPath = path.join(options.outputDirectory, path.join(...directory.path));
    fs.ensureDirSync(directoryPath);

    _.forOwn(directory.files, (file) => {
      const content = file.render();
      const filePath = path.join(options.outputDirectory, path.join(...file.path));
      winston.verbose(`Writing ${filePath}`);
      fs.writeFileSync(filePath, content);
      generatedFiles.push(filePath);
    });
  });

  if (options.cleanUnknownFiles !== false) {
    const extraKnownFiles
      = options.keep.map(filename => path.join(options.outputDirectory, filename));
    Array.prototype.push.apply(generatedFiles, extraKnownFiles);
    cleanUnknownFiles(options.outputDirectory, generatedFiles);
  }

  return Promise.resolve();
}

module.exports = generate;
