const serve = require('./serve');
const createPost = require('./create-post');
const build = require('./build');
const generatePosts = require('./generate-posts');

module.exports = {
  commands: {
    build,
    serve,
    'create-post': createPost,
    'generate-posts': generatePosts,
  },
};
