const path = require('path');
const fs = require('fs-extra');
const logger = require('./logger');

class Loader {
  constructor() {
    this._paths = [];
  }

  addPath(templatePath) {
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
