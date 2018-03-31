const _ = require('lodash');

/** A filtered and sorted subset of posts. */
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
      return (a, b) => b.publishedAt - a.publishedAt;
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
   * @param {*} field
   */
  uniqueValues(field) {
    return _.uniq(this.execute()
      .filter(post => post.has(field))
      .map(post => post.get(field))
      .reduce((result, value) => {
        if (value instanceof Array) {
          return result.concat(value);
        }
        return result.concat([value]);
      }, []));
  }

  /**
   * Return a dictionary of slices keyed to each unique value of the grouping field.
   * @param {*} field
   */
  groupBy(field) {
    return this.uniqueValues(field)
      .map((uniqueValue) => {
        const filter = (post) => {
          if (!post.has(field)) {
            return false;
          }

          const value = post.get(field);
          if (value instanceof Array) {
            return value.includes(uniqueValue);
          }
          return value === uniqueValue;
        };

        return [uniqueValue, new Slice(this, filter)];
      });
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
