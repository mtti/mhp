const atom = require('./atom');
const posts = require('./posts');
const indexes = require('./indexes');
const { filterMiddlewareConstructor, sortMiddlewareConstructor } = require('./filter-and-sort');

module.exports = {
  atom,
  posts,
  indexes,
  filter: filterMiddlewareConstructor,
  sort: sortMiddlewareConstructor,
};
