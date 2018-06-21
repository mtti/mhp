const _ = require('lodash');

class Request {
  get site() {
    return this._site;
  }

  get path() {
    return this._path.slice();
  }

  get uriParts() {
    const pathCopy = this._path.slice();
    const filename = pathCopy.slice(-1)[0].split('.');

    if (filename.length > 1 && filename.slice(-1)[0] === 'html') {
      if (filename[0] === 'index') {
        pathCopy.splice(pathCopy.length - 1, 1);
      } else {
        pathCopy[pathCopy.length - 1] = filename.slice(0, -1).join('.');
      }
    }

    return pathCopy;
  }

  get uri() {
    return this.uriParts.join('/');
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
