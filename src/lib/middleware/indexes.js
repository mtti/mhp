const _ = require('lodash');
const nunjucks = require('nunjucks');

function indexMiddlewareConstructor(options = {}) {
  const opts = {
    firstPageFilename: 'index.html',
    filenamePattern: 'index-{{page}}.html',
    postsPerPage: 15,
    template: 'post-index.html',
  };

  _.merge(opts, options);

  return function indexMiddleware(req, res) {
    const posts = res.posts.findAll();

    const totalPages = Math.ceil(posts.length / opts.postsPerPage) || 1;

    for (let i = 0; i < totalPages; i += 1) {
      const skip = i * opts.postsPerPage;

      const context = {
        currentPage: i + 1,
        totalPages,
        posts: posts.slice(skip, skip + opts.postsPerPage),
      };
      const renderOptions = {
        path: req.path,
      };

      let filename;
      let template = opts.template;
      if (i === 0) {
        filename = opts.firstPageFilename;
        if (opts.firstPageTemplate) {
          template = opts.firstPageTemplate;
        }
      } else {
        filename = nunjucks.renderString(opts.filenamePattern, { page: i + 1 });
      }
      renderOptions.path.push(filename);

      res.render(template, context, renderOptions);
    }
  }
}

module.exports = indexMiddlewareConstructor;
