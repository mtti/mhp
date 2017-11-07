const generate = require('./generate');
const init = require('./init');
const serve = require('./serve');
const createPost = require('./create-post');

module.exports = {
  commands: {
    generate,
    init,
    serve,
    'create-post': createPost,
  },
};
