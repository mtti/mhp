const serve = require('./serve');
const createPost = require('./create-post');
const generateRoutes = require('./generate-routes');
const generatePosts = require('./generate-posts');

module.exports = {
  commands: {
    serve,
    'create-post': createPost,
    'generate-routes': generateRoutes,
    'generate-posts': generatePosts,
  },
};
