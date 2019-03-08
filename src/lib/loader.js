const path = require('path');
const fs = require('fs-extra');
const logger = require('./logger');

/**
 * Custom nunjucks template loader which can accepts multiple source directories. A template is
 * loaded from the most recently added directory which contains it. This allows site specific
 * templates to override default templates.
 */
class Loader {
  constructor() {
    this._paths = [];
  }

  addPath(templatePath) {
    if (typeof templatePath !== 'string') {
      throw new Error('templatePath must be a string');
    }
    this._paths.push(templatePath);
  }

  findTemplate(templateName) {
    for (let i = this._paths.length - 1; i >= 0; i -= 1) {
      const fullPath = path.join(this._paths[i], templateName);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    logger.error(`Template not found: ${templateName}`);
    return null;
  }

  getSource(name) {
    const templatePath = this.findTemplate(name);
    if (!templatePath) {
      return null;
    }

    const src = fs.readFileSync(templatePath, 'utf8');
    return {
      src,
      path: templatePath,
    };
  }
}

module.exports = Loader;
