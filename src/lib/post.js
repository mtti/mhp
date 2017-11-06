
const _ = require('lodash');
const marked = require('marked');
const nunjucks = require('nunjucks');
const slugify = require('slugify');

class Post {
  get slug() {
    if (this.fields.slug) {
      return this.fields.slug;
    } else if (this.basename) {
      return this.basename;
    } else if (this.fields.title) {
      return slugify(this.fields.title);
    }
    throw new Error('Unable to generate slug');
  }

  get html() {
    return marked(this.fields.body);
  }

  get safeHtml() {
    return new nunjucks.runtime.SafeString(this.html);
  }

  get uri() {
    if (this.canonicalFile) {
      return this.canonicalFile.uri;
    }
    throw new Error('Tried to generate URI for a post with no canonical location');
  }

  get url() {
    if (this.canonicalFile) {
      return this.canonicalFile.url;
    }
    throw new Error('Tried to generate URL for a post with no canonical location');
  }

  constructor(fields, options) {
    this.fields = _.cloneDeep(fields);
    this.basename = options.basename;
    this.canonicalFile = null;
  }

  setCanonical(fileNode) {
    if (!this.canonicalFile) {
      this.canonicalFile = fileNode;
    }
  }
}

module.exports = Post;
