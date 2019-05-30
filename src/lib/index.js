const { Router } = require('./router');
const middleware = require('./middleware');

module.exports = {
  Router,
  ...middleware,
};
