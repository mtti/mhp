
const nunjucks = require('nunjucks');

module.exports = function (directory, options) {
  const posts = directory.slice.execute();

  options.filenamePattern = options.filenamePattern || 'index-{{page}}.html';
  options.firstPageFilename = options.firstPageFilename || 'index.html';
  options.postsPerPage = options.postsPerPage || 15;

  totalPages = Math.ceil(posts.length / options.postsPerPage) || 1;

  for (let i = 0; i < totalPages; i += 1) {
    const skip = i * options.postsPerPage;
    const fileOptions = {
      type: 'text/html',
      name: nunjucks.renderString(options.filenamePattern, { page: i + 1 }),
      vars: {
        currentPage: i + 1,
        totalPages,
        posts: posts.slice(skip, skip + options.postsPerPage),
      },
    };

    if (options.template) {
      fileOptions.template = options.template;
    }

    if (i === 0) {
      fileOptions.name = options.firstPageFilename;
      if (options.firstPageTemplate) {
        fileOptions.template = options.firstPageTemplate;
      }
    }

    directory.addFile(fileOptions);
  }
};
