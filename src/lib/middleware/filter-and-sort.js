function filterMiddlewareConstructor(filters) {
  const filterMiddleware = (req, res) => {
    res.posts = res.posts.filter(filters);
  };
  filterMiddleware._mhp_filter = true;
  return filterMiddleware;
}

function sortMiddlewareConstructor(sorter) {
  const sortMiddleware = (req, res) => {
    res.posts = res.posts.sort(sorter);
  };
  sortMiddleware._mhp_sorter = true;
  return sortMiddleware;
}

module.exports = {
  filterMiddlewareConstructor,
  sortMiddlewareConstructor,
};
