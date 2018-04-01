const path = require('path');
const mime = require('mime-types');

class Response {
  get posts() {
    return this._postSet;
  }

  constructor(site, postSet) {
    this._site = site;
    this._postSet = postSet;
  }

  write(filePath, contentType, content) {
    const pathCopy = filePath.slice();

    // If no file extension was given, guess it from the content type
    const filename = pathCopy.slice(-1)[0];
    if (filename.split('.').length === 1) {
      const extension = mime.extension(contentType);
      if (extension) {
        pathCopy[pathCopy.length - 1] = `${filename}.${extension}`;
      }
    }

    const directoryPath = path.join(this._site.outputDirectory, path.join(...pathCopy));
    console.log(`Would write ${directoryPath}`);
  }

  render(filePath, template, context) {
    const content = this._site.nunjucks.render(template, context);
    this.write(filePath, 'text/html', content);
  }
}

module.exports = Response;
