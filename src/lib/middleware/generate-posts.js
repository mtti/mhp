const _ = require('lodash');

function generatePostsConstructor(options = {}) {
  const opts = {
    canonical: true,
    template: 'post.html',
  };

  return function generatePostsMiddleware(req, res) {
    const posts = res.posts.findAll();
    if (posts.length !== 1) {
      throw new Error(`generatePosts requires exactly 1 post, got ${postCount}`);
    }
    const post = posts[0];

    if (opts.canonical) {
      post.canonicalURL = res.url();
    }

    res.render(opts.template, { post });
  }
}

module.exports = generatePostsConstructor;
