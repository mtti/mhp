
const _ = require('lodash');
const marked = require('marked');
const slugify = require('slugify');

class Post {
  get slug() {
    if (this.fields.slug) {
      return this.fields.slug;
    } else if (this.basename) {
      return this.basename;
    } else if (this.fields.title) {
      return slugify(this.fields.title);
    } else {
      throw new Error('Unable to generate slug');
    }
  }

  get html() {
    return marked(this.fields.body);
  }

  get uri() {
    if (this.canonicalPath) {
      return this.canonicalPath.join('/');
    } else {
      throw new Error('Tried to generate URI for a post with no canonical path');
    }
  }

  constructor(fields, options) {
    this.fields = _.cloneDeep(fields);
    this.basename = options.basename;
    this.canonicalPath = null;
  }
}

module.exports = Post;
