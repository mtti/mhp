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

function generateFeed(directory, options) {
  const posts = directory.slice.findAll();

  const filename = options.filename || 'atom.xml';

  if (!options.uuid) {
    throw new Error('Feed UUID is required');
  }

  const updated = findNewestUpdateAt(posts);
  const feed = new Feed({
    title: options.title,
    id: `urn:uuid:${options.uuid}`,
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

  const fileOptions = {
    name: filename,
    type: 'application/atom+xml',
    content: feed.atom1(),
  };

  directory.addFile(fileOptions);
}

module.exports = generateFeed;
