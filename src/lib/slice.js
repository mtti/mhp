const _ = require('lodash');

class Slice {
  static parseFilter(filter) {
    if (!filter) {
      return [];
    } else if (filter instanceof Array) {
      return _.flattenDeep(filter.map(Slice.parseFilter));
    } else if (typeof filter === 'function') {
      return [filter];
    } else if (typeof filter === 'object') {
      return [post => _.isMatch(post.fields, filter)];
    }
    throw new Error(`Unsupported filter type: ${typeof filter}`);
  }

  static parseSort(sort) {
    if (!sort) {
      return null;
    } else if (typeof sort === 'function') {
      return sort;
    } else if (typeof sort === 'string') {
      return (a, b) => b.fields[sort] - a.fields[sort];
    }
    throw new Error(`Unsupported sort type: ${typeof sort}`);
  }

  constructor(parent, filters, sorter) {
    this.parent = parent;
    this.filters = Slice.parseFilter(filters);
    this.sorter = Slice.parseSort(sorter);
  }

  /**
   * Get an array of all the unique values of the given field across all posts matched by this
   * slice.
   *
   * @param {*} field
   */
  uniqueValues(field) {
    const posts = this.execute();

    const resultObject = _.reduce(posts, (result, post) => {
      if (field in post) {
        result[post[field]] = true;
      }
      return result;
    }, {});

    return _.reduce(resultObject, (result, value, key) => {
      result.push(key);
      return result;
    }, []);
  }

  /**
   * Return a dictionary of slices, keyed by each unique value of the field, which match a subset
   * of this slice where the grouping field has the respective value.
   * @param {*} field
   */
  groupBy(field) {
    const groups = this.uniqueValues(field);
    return _.reduce(groups, (result, value) => {
      result[value] = new Slice(this, post => post[field] === value);
      return result;
    }, {});
  }

  /**
   * Return all posts matched by this slice.
   */
  execute() {
    const result = this.parent.execute().filter((post) => {
      for (let i = 0; i < this.filters.length; i += 1) {
        if (!this.filters[i](post)) {
          return false;
        }
      }
      return true;
    });

    if (this.sorter) {
      return result.sort(this.sorter);
    }

    return result;
  }
}

module.exports = Slice;
