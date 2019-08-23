const moment = require('moment');
const { Feed } = require('feed');
const { suffixPathFilename } = require('../utils');

function findNewestUpdateAt(posts) {
  if (posts.length === 0) {
    return moment(0);
  }

  let newest = posts[0].updatedAt;
  posts.slice(1).forEach((post) => {
    if (post.updatedAt.isAfter(newest)) {
      newest = post.updatedAt;
    }
  });

  return newest;
}

function generateFeeds(options = {}) {
  if (!options.title) {
    throw new Error('Feed title is required');
  }
  if (!options.uuid) {
    throw new Error('Feed UUID is required');
  }

  const opts = {
    formats: ['atom', 'rss'],
    ...options,
  };

  return function feedMiddleware(req, res) {
    const posts = res.posts.findAll().slice(0, 50);
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
        link: post.url,
        content: post.html,
        date: post.publishedAt.toDate(),
      });
    });

    if (opts.formats.includes('atom')) {
      res.write(feed.atom1(), {
        path: suffixPathFilename(req.path, '.atom.xml'),
        contentType: 'application/atom+xml',
      });
    }
    if (opts.formats.includes('rss')) {
      res.write(feed.rss2(), {
        path: suffixPathFilename(req.path, '.rss.xml'),
        contentType: 'applications/rss+xml',
      });
    }
  };
}

module.exports = { generateFeeds };
