const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const generators = require('../generators');

function generate(argv, options, site) {
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

      console.log(`Writing ${filePath}`);
      fs.writeFileSync(filePath, content);
    });
  });

  return Promise.resolve();
}

module.exports = generate;
