const posts = require('./posts');
const indexes = require('./indexes');
const { filterMiddlewareConstructor, sortMiddlewareConstructor } = require('./filter-and-sort');
const { generateFeeds } = require('./feed');

module.exports = {
  generatePostPages: posts,
  generatePostIndexes: indexes,
  filterPosts: filterMiddlewareConstructor,
  sortPosts: sortMiddlewareConstructor,
  generateFeeds,
};
