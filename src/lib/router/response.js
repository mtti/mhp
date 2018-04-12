const path = require('path');
const _ = require('lodash');
const mime = require('mime-types');

class Response {
  get posts() {
    return this._postSet;
  }

  constructor(site, globals, req, postSet) {
    this._site = site;
    this._req = req;
    this._postSet = postSet;
    this._globals = globals;
  }

  url(uriParts) {
    let uri;
    if (uriParts) {
      uri = uriParts.join('/');
    } else {
      uri = this._req.path.join('/');
    }
    return `${this._globals.baseURL}/${uri}`;
  }

  render(template, context = {}, options = {}) {
    const vars = _.cloneDeep(this._globals);
    _.merge(vars, context);

    const content = this._site.nunjucks.render(template, vars);
    return this.write(content, options);
  }

  write(content, options = {}) {
    const opts = {
      contentType: 'text/html',
    };
    _.merge(opts, options);

    let pathCopy;
    if (options.path) {
      pathCopy = options.path.slice();
    } else {
      pathCopy = this._req.path.slice();
    }

    // If no file extension was given, guess it from the content type
    const filename = pathCopy.slice(-1)[0];
    if (filename.split('.').length === 1) {
      const extension = mime.extension(opts.contentType);
      if (extension) {
        pathCopy[pathCopy.length - 1] = `${filename}.${extension}`;
      }
    }

    const directoryPath = path.join(this._site.outputDirectory, path.join(...pathCopy));
    console.log(`Would write ${directoryPath}`);
  }
}

module.exports = Response;
