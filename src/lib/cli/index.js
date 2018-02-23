const generate = require('./generate');
const serve = require('./serve');
const createPost = require('./create-post');

module.exports = {
  commands: {
    generate,
    serve,
    'create-post': createPost,
  },
};
