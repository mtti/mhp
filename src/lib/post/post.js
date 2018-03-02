const _ = require('lodash');
const cheerio = require('cheerio');
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

  get publishedAt() {
    return moment(this.fields.publishedAt);
  }

  get updatedAt() {
    if (this.fields.updatedAt) {
      return moment(this.fields.updatedAt);
    }
    return this.publishedAt;
  }

  get summary() {
    if (this.fields.summary) {
      return this.fields.summary;
    }

    const doc = cheerio.load(this.html);
    return doc('p').first().html();
  }

  constructor(fields, options) {
    this.fields = _.cloneDeep(fields);
    this.basename = options.basename;
    this.sourcePath = options.sourcePath;
    this.canonicalFile = null;
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
