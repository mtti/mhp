const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const winston = require('winston');
const marked = require('marked');
const nunjucks = require('nunjucks');
const generators = require('../generators');

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
      .forEach(item => {
        clean(item.filePath);
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

  // Generate only posts first so that canonical paths get set.
  site.root.walk((directory) => {
    if (directory.attributes.filterPosts) {
      directory.ownSlice = site.postDb.slice(directory.attributes.filterPosts);
    }

    directory.generators
      .filter(generatorOptions => generatorOptions.generator === 'posts')
      .forEach((generatorOptions) => {
        generators[generatorOptions.generator](directory, generatorOptions);
      });
  });

    // After canonical paths have been set, run all other generators.
  site.root.walk((directory) => {
    directory.generators
      .filter(generatorOptions => generatorOptions.generator !== 'posts')
      .forEach((generatorOptions) => {
        generators[generatorOptions.generator](directory, generatorOptions);
      })
  });

  site.root.walk((directory) => {
    const directoryPath = path.join(options.outputDirectory, path.join(...directory.path));
    fs.ensureDirSync(directoryPath);

    _.forOwn(directory.files, (file) => {
      const filePath = path.join(options.outputDirectory, path.join(...file.path));
      const vars = _.cloneDeep(file.vars);

      let content = '';
      if (file.attributes.content) {
        content = file.attributes.content;
      } else if (file.attributes.page) {
        const contentPath = path.join(options.inputDirectory, 'pages', file.attributes.page);
        const contentMarkdown = fs.readFileSync(contentPath, 'utf8');
        vars.content = new nunjucks.runtime.SafeString(marked(contentMarkdown));
        content = site.nunjucks.render(file.template, vars);
      } else {
        content = site.nunjucks.render(file.template, vars);
      }

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
