const _ = require('lodash');
const cheerio = require('cheerio');
const marked = require('marked');
const moment = require('moment');
const nunjucks = require('nunjucks');
const slugify = require('slugify');
const striptags = require('striptags');

class Post {
  get slug() {
    if (this.fields.slug) {
      return this.fields.slug;
    } if (this.basename) {
      return this.basename;
    } if (this.fields.title) {
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
    if (this._canonicalUrl) {
      return this._canonicalUrl;
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
    return striptags(doc('p').first().html());
  }

  constructor(fields, options) {
    this.fields = _.cloneDeep(fields);
    this.basename = options.basename;
    this.sourcePath = options.sourcePath;
    this._canonicalUrl = null;
  }

  /** Get the value of a property or field */
  get(key) {
    if (key in this) {
      const value = this[key];
      if (typeof value !== 'function') {
        return value;
      }
    }
    return this.fields[key];
  }

  /** Check if the post has a property or a field */
  has(key) {
    return (key in this.fields) || (key in this);
  }

  setCanonical(url) {
    if (!this._canonicalUrl) {
      this._canonicalUrl = url;
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
