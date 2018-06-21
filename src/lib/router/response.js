const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const mime = require('mime-types');
const fm = require('front-matter');
const marked = require('marked');
const nunjucks = require('nunjucks');
const winston = require('winston');

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
    return `${this._globals.baseUrl}/${uri}`;
  }

  renderPage(pagePath, context = {}, options = {}) {
    const sourcePath = path.join(this._site.pageDirectory, pagePath);
    const page = fm(fs.readFileSync(sourcePath, 'utf8'));

    let template = 'page.html';
    if (page.attributes.template) {
      template = page.attributes.template;
    }

    const ctx = {};
    if (page.attributes.vars) {
      _.merge(ctx, page.attributes.vars);
    }
    _.merge(ctx, context);
    ctx.body = new nunjucks.runtime.SafeString(marked(page.body));

    return this.render(template, ctx, options);
  }

  render(template, context = {}, options = {}) {
    const vars = _.cloneDeep(this._globals);
    _.merge(vars, context);

    vars.uriParts = this._req.uriParts;
    vars.uri = this._req.uri;

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

    // Make sure final output directory exists
    const directoryParts = pathCopy.slice(0, -1);
    fs.ensureDirSync(path.join(this._site.outputDirectory, path.join(...directoryParts)));

    // Write the output file
    const filePath = path.join(
      this._site.outputDirectory,
      path.join(...pathCopy),
    );
    winston.verbose(`Writing ${filePath}`);
    fs.writeFileSync(filePath, content);
    this._site.generatedFiles.push(filePath);
  }
}

module.exports = Response;
