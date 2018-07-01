function filterMiddlewareConstructor(filters) {
  return function filterMiddleware(req, res) {
    res.posts = res.posts.filter(filters);
  };
}

function sortMiddlewareConstructor(sorter) {
  return function sortMiddleware(req, res) {
    res.posts = res.posts.sort(sorter);
  };
}

module.exports = {
  filterMiddlewareConstructor,
  sortMiddlewareConstructor,
};
