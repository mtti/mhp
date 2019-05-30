const atom = require('./atom');
const posts = require('./posts');
const indexes = require('./indexes');
const { filterMiddlewareConstructor, sortMiddlewareConstructor } = require('./filter-and-sort');

module.exports = {
  generateAtomFeed: atom,
  generatePostPages: posts,
  generatePostIndexes: indexes,
  filterPosts: filterMiddlewareConstructor,
  sortPosts: sortMiddlewareConstructor,
};
