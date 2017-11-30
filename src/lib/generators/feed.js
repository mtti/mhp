const Feed = require('feed');

function generateFeed(directory, options) {
  const posts = directory.slice.execute();

  const filename = options.filename || 'atom.xml';

  if (!options.uuid) {
    throw new Error('Feed UUID is required');
  }

  const feed = new Feed({
    title: options.title,
    id: `urn:uuid:${options.uuid}`,
    updated: new Date(),
  });

  posts.forEach((post) => {
    if (!post.fields.uuid) {
      throw new Error(`Post ${post.uri} is missing an UUID`);
    }

    feed.addItem({
      title: post.fields.title,
      id: `urn:uuid:${post.fields.uuid}`,
      link: post.url,
      content: post.html,
      date: new Date(),
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
