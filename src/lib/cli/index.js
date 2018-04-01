const generate = require('./generate');
const serve = require('./serve');
const createPost = require('./create-post');
const generateRoutes = require('./generate-routes');

module.exports = {
  commands: {
    generate,
    serve,
    'create-post': createPost,
    'generate-routes': generateRoutes,
  },
};
