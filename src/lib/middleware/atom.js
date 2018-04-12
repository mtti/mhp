const _ = require('lodash');
const Feed = require('feed');

function findNewestUpdateAt(posts) {
  if (posts.length === 0) {
    return null;
  }

  let newest = posts[0].updatedAt;
  posts.slice(1).forEach((post) => {
    if (post.updatedAt.isAfter(newest)) {
      newest = post.updatedAt;
    }
  });

  return newest;
}

function atomConstructor(options = {}) {
  if (!options.title) {
    throw new Error('Feed title is required');
  }
  if (!options.uuid) {
    throw new Error('Feed UUID is required');
  }

  const opts = {};
  _.merge(opts, options);

  return function atomMiddleware(req, res) {
    const posts = res.posts.findAll();
    const updated = findNewestUpdateAt(posts);
    const feed = new Feed({
      title: opts.title,
      id: `urn:uuid:${opts.uuid}`,
      updated: updated.toDate(),
    });

    posts.forEach((post) => {
      feed.addItem({
        title: post.fields.title,
        id: `urn:uuid:${post.fields.uuid}`,
        link: post.canonicalURL,
        content: post.html,
        date: post.publishedAt.toDate(),
      });
    });

    const fileOptions = {
      path: req.path,
      contentType: 'application/atom+xml',
    };
    res.write(feed.atom1(), fileOptions);
  }
}

module.exports = atomConstructor;
