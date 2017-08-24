
const Feed = require('feed');

module.exports = (directory, options) => {
  const posts = directory.slice.execute();

  const filename = options.filename || 'atom.xml';

  const feed = new Feed({
    title: 'title',
    id: 'feed id',
    link: 'http://example.com',
    updated: new Date(),
  });

  posts.forEach((post) => {
    const id = post.id || post.uri;
    feed.addItem({
      title: post.fields.title,
      id,
      link: 'http://example.com',
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
};
