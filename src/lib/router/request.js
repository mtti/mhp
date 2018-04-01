const _ = require('lodash');

class Request {
  get path() {
    return this._path;
  }

  get params() {
    return this._params;
  }

  constructor(path, params) {
    this._path = path.slice();
    this._params = _.cloneDeep(params);
  }
}

module.exports = Request;
