const _ = require('lodash');
const marked = require('marked');
const moment = require('moment');
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
    throw new Error(`Tried to generate URL for post ${this.sourcePath}`
      + ' which has no canonical location');
  }

  constructor(fields, options) {
    this.fields = _.cloneDeep(fields);
    this.basename = options.basename;
    this.sourcePath = options.sourcePath;
    this.canonicalFile = null;

    if (this.fields.publishedAt) {
      this.publishedAt = moment(this.fields.publishedAt);
    }
  }

  setCanonical(fileNode) {
    if (!this.canonicalFile) {
      this.canonicalFile = fileNode;
    }
  }

  hasTag(tag) {
    return (this.fields.tags) && (this.fields.tags.indexOf(tag) > -1);
  }

  validate() {
    const errors = [];

    if (!this.fields.uuid) {
      errors.push('Missing field "uuid"');
    }
    if (!this.fields.publishedAt) {
      errors.push('Missing field "publishedAt"');
    }

    return errors;
  }
}

module.exports = Post;
