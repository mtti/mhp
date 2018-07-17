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

    const pages = [];
    for (let i = 0; i < totalPages; i += 1) {
      const page = {
        index: i,
        number: i + 1,
        first: i === 0,
        last: i === totalPages - 1,
      };
      const uriParts = req.path;

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
      uriParts.push(filename);

      page.uri = uriParts.join('/');
      pages.push(page);
    }

    for (let i = 0; i < totalPages; i += 1) {
      const skip = i * opts.postsPerPage;

      const context = {
        pages,
        firstPage: pages[0],
        currentPage: pages[i],
        lastPage: pages[pages.length - 1],
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
  };
}

module.exports = indexMiddlewareConstructor;
