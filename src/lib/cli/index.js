const generate = require('./generate');
const init = require('./init');
const serve = require('./serve');

module.exports = {
  commands: {
    generate,
    init,
    serve,
  },
};
