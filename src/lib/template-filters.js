const _ = require('lodash');
const moment = require('moment');
const nunjucks = require('nunjucks');
const logger = require('./logger');
const { Post } = require('./post');
const { isInActivePath, mustNotEndWith, cleanUri } = require('./utils');

const { SafeString } = nunjucks.runtime;

function date(input, format) {
  let useFormat = 'YYYY-MM-DD';
  if (format) {
    useFormat = format;
  } else if (this.ctx.dateFormat) {
    useFormat = this.ctx.dateFormat;
  }
  return moment(input).format(useFormat);
}

function assetUrl(input) {
  let filename = input;
  if (this.ctx.assetManifest && input in this.ctx.assetManifest) {
    filename = this.ctx.assetManifest[input];
  }
  return `${this.ctx.baseUrl}/assets/${filename}`;
}

function url(input) {
  if (input instanceof Post) {
    return input.url;
  }

  const baseUrl = mustNotEndWith(this.ctx.baseUrl, '/');
  const uri = cleanUri(input);

  return `${baseUrl}/${uri}`;
}

function navlink(uri, kwargs = {}) {
  const activeClass = kwargs.activeClass || 'active';
  const className = kwargs.class || '';
  const text = kwargs.text || uri;
  const href = url.call(this, uri);
  const exact = kwargs.exact || false;
  const classes = className.split(' ').filter(item => item.length > 0);

  if (isInActivePath(uri, this.ctx.uri, exact)) {
    classes.push(activeClass);
  }
  const isExact = isInActivePath(uri, this.ctx.uri, true);

  let classStr = '';
  if (classes.length > 0) {
    classStr = ` class="${classes.join(' ')}"`;
  }

  if (!isExact) {
    return new SafeString(`<a href="${href}"${classStr}>${text}</a>`);
  }
  return new SafeString(`<span${classStr}>${text}</span>`);
}

function ifActivePath(str, uri, kwargs = {}) {
  const exact = kwargs.exact || false;

  if (isInActivePath(uri, this.ctx.uri, exact)) {
    return str;
  }
  return '';
}

function _wrapFilter(filterFunc) {
  return function wrappedFilter(...args) {
    try {
      return filterFunc.call(this, ...args);
    } catch (err) {
      logger.error(err.stack);
      throw err;
    }
  };
}

const filters = {
  date,
  assetUrl,
  url,
  navlink,
  ifActivePath,
};
module.exports = _.fromPairs(_.toPairs(filters).map(pair => [pair[0], _wrapFilter(pair[1])]));
