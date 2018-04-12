const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const winston = require('winston');
const { cleanUnknownFiles } = require('../utils');

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
