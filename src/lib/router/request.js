const _ = require('lodash');

class Request {
  get site() {
    return this._site;
  }

  get path() {
    return this._path.slice();
  }

  get params() {
    return this._params;
  }

  constructor(site, path, params) {
    this._site = site;
    this._path = path.slice();
    this._params = _.cloneDeep(params);
  }
}

module.exports = Request;
