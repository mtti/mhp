const moment = require('moment');
const nunjucks = require('nunjucks');
const { Post } = require('./post');
const { isInActivePath } = require('./utils');

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
  if (input in this.ctx.assetManifest) {
    filename = this.ctx.assetManifest[input];
  }
  return `${this.ctx.baseUrl}/assets/${filename}`;
}

function url(input) {
  if (input instanceof Post) {
    return input.url;
  }
  return `${this.ctx.baseUrl}/${input}`;
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

  let classStr = '';
  if (classes.length > 0) {
    classStr = ` class="${classes.join(' ')}"`;
  }

  const result = `<a href="${href}"${classStr}>${text}</a>`;
  return new nunjucks.runtime.SafeString(result);
}

function ifActivePath(str, uri, kwargs = {}) {
  const exact = kwargs.exact || false;

  if (isInActivePath(uri, this.ctx.uri, exact)) {
    return str;
  }
  return '';
}

module.exports = {
  date,
  assetUrl,
  url,
  navlink,
  ifActivePath,
};
