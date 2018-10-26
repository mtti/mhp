const _ = require('lodash');
const logger = require('../logger');

function postMiddlewareConstructor(options = {}) {
  const opts = {
    canonical: true,
    template: 'post.html',
  };

  _.merge(opts, options);

  const postMiddleware = (req, res) => {
    const posts = res.posts.findAll();
    if (posts.length === 0) {
      logger.warn(`No posts found at ${req.uri}`);
    } else if (posts.length > 1) {
      throw new Error(`posts middleware requires at most 1 post, got ${posts.length}`);
    }
    const post = posts[0];

    if (opts.canonical) {
      post.setCanonical(res.url());
    }

    res.render(opts.template, { post });
  };
  postMiddleware._mhp_priority = true;
  return postMiddleware;
}

module.exports = postMiddlewareConstructor;
