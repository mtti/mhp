const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const winston = require('winston');
const marked = require('marked');
const nunjucks = require('nunjucks');
const fm = require('front-matter');
const generators = require('../generators');
const { replaceExtension } = require('../utils');

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

function generate(argv, options, site) {
  const generatedFiles = [];

  // Generate only posts first so that canonical paths get set.
  site.root.walk((directory) => {
    if (directory.attributes.filterPosts) {
      directory.ownSlice = site.postDb.slice(directory.attributes.filterPosts);
    } else if (directory.attributes.filterPostsWith) {
      directory.ownSlice = site.postDb.slice(site.functions[directory.attributes.filterPostsWith]);
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
      });
  });

  site.root.walk((directory) => {
    const directoryPath = path.join(options.outputDirectory, path.join(...directory.path));
    fs.ensureDirSync(directoryPath);

    _.forOwn(directory.files, (file) => {
      const filePath = path.join(options.outputDirectory, path.join(...file.path));

      let page;
      if (file.attributes.page) {
        const pagePath = replaceExtension(file.path.join(path.sep), 'md');
        const contentPath = path.join(options.inputDirectory, 'pages', pagePath);

        // Load page source file, merge in node attributes from front matter
        page = fm(fs.readFileSync(contentPath, 'utf8'));
        file.attributes = _.merge(file.attributes, page.attributes);

        // Load optional controller file from same directory as source file
        const dirName = path.dirname(contentPath);
        const baseName = path.basename(contentPath).split('.')[0];
        const controllerPath = path.join(dirName, `${baseName}.controller.js`);
        if (fs.existsSync(controllerPath)) {
          winston.verbose(`Using controller ${controllerPath}`);
          // eslint-disable-next-line global-require, import/no-dynamic-require
          file.controller = require(controllerPath);
        }
      }

      let vars;
      let controller;
      if (file.attributes.controller) {
        if (!(file.attributes.controller in site.functions)) {
          throw new Error(`Controller does not exist: ${file.attributes.controller}`);
        }
        controller = site.functions[file.attributes.controller];
      } else if (file.controller) {
        controller = file.controller;
      }
      if (controller) {
        vars = controller(file, directory, site);
      } else {
        vars = _.cloneDeep(file.vars);
      }

      vars.breadcrumbs = file.breadcrumbs;

      let content = '';
      if (file.attributes.content) {
        content = file.attributes.content;
      } else {
        if (page) {
          vars.content = new nunjucks.runtime.SafeString(marked(page.body));
        }
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
