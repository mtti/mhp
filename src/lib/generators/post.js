
const FileNode = require('../file-node');

function generate(directory) {
  if (!directory.slice) {
    return;
  }

  directory.slice.execute().forEach(post => {
    const options = {
      vars: {
        post: post,
      },
      type: 'text/html',
      name: `${post.slug}.html`,
    };
    const file = directory.addFile(options);

    if (!post.canonicalPath) {
      post.canonicalPath = file.path;
    }
  });
}

module.exports = generate;
