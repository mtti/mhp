const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const winston = require('winston');
const generators = require('../generators');

function cleanUnknownFiles(outputDirectory, knownFiles) {
  const known = _.fromPairs(knownFiles.map(filename => [filename, true]));

  function clean(directory) {
    const files = fs.readdirSync(directory);
    const subdirectories = [];

    files.forEach((filename) => {
      const filePath = path.join(directory, filename);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        if (!known[filePath]) {
          winston.verbose(`Deleting ${filePath}`);
          fs.removeSync(filePath);
        }
      } else if (stats.isDirectory()) {
        subdirectories.push(filePath);
      }
    });

    subdirectories.forEach((subdirectory) => {
      clean(subdirectory);
    });

    if (fs.readdirSync(directory).length === 0) {
      winston.verbose(`Removing empty directory ${directory}`);
      fs.rmdirSync(directory);
    }
  }

  clean(outputDirectory);
}

function generate(argv, options, site) {
  const generatedFiles = [];

  site.root.walk((directory) => {
    if (directory.attributes.filterPosts) {
      directory.ownSlice = site.postDb.slice(directory.attributes.filterPosts);
    }

    directory.generators.forEach((generatorOptions) => {
      generators[generatorOptions.generator](directory, generatorOptions);
    });
  });

  site.root.walk((directory) => {
    const directoryPath = path.join(options.outputDirectory, path.join(...directory.path));
    fs.ensureDirSync(directoryPath);

    _.forOwn(directory.files, (file) => {
      const filePath = path.join(options.outputDirectory, path.join(...file.path));
      const vars = file.vars;

      let content = '';
      if (file.attributes.content) {
        content = file.attributes.content;
      } else {
        content = site.nunjucks.render(file.template, vars);
      }

      winston.verbose(`Writing ${filePath}`);
      fs.writeFileSync(filePath, content);
      generatedFiles.push(filePath);
    });
  });

  const extraKnownFiles
    = options.noclean.map(filename => path.join(options.outputDirectory, filename));
  Array.prototype.push.apply(generatedFiles, extraKnownFiles);

  cleanUnknownFiles(options.outputDirectory, generatedFiles);

  return Promise.resolve();
}

module.exports = generate;
