const moment = require('moment');

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
  return `${this.ctx.baseUrl}/${input}`;
}

module.exports = {
  date,
  assetUrl,
  url,
};
