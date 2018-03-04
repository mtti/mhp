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

module.exports = {
  date,
};
