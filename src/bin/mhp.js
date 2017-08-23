#!/usr/bin/env node

const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const minimist = require('minimist');
const Nunjucks = require('nunjucks');
const PostDB = require('../lib/post-db');
const DirectoryNode = require('../lib/directory-node');
const generators = require('../lib/generators');

process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

const argv = minimist(process.argv.slice(2));

const options = {
  inputDirectory: argv.directory || process.cwd(),
};
options.outputDirectory = path.join(options.inputDirectory, 'dist');

const nunjucks = Nunjucks.configure(path.join(options.inputDirectory, 'templates'));

const root = DirectoryNode.fromFile(path.join(options.inputDirectory, 'mhp.yml'));

const postDb = new PostDB();
postDb.loadDirectory(path.join(options.inputDirectory, 'posts'))
  .then(() => {
    console.log(`Loaded ${postDb.posts.length} posts`);

    root.walk((directory) => {
      if (directory.attributes.filterPosts) {
        directory.slice = postDb.slice(directory.attributes.filterPosts);
      }

      directory.generators.forEach((options) => {
        generators[options.generator](directory, options);
      });
    });

    root.walk((directory) => {
      const directoryPath = path.join(options.outputDirectory, path.join(...directory.path));
      fs.ensureDirSync(directoryPath);

      _.forOwn(directory.files, (file, key) => {
        const filePath = path.join(options.outputDirectory, path.join(...file.path));
        const vars = file.vars;

        let content = '';
        if (file.attributes.content) {
          content = file.attributes.content;
        } else {
          content = nunjucks.render(file.template, vars);
        }
        console.log(`Writing: ${filePath}`);
        fs.writeFileSync(filePath, content);
      });
    });
  });
