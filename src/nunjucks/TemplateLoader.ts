import path from 'path';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';

export class TemplateLoader implements nunjucks.ILoader {
  private _directories: readonly string[] = [];

  constructor(directories: readonly string[]) {
    this._directories = [...directories].reverse();
  }

  getSource(name: string): nunjucks.LoaderSource {
    const fullPath = this.find(name);

    return {
      src: fs.readFileSync(fullPath, 'utf8'),
      path: fullPath,
      noCache: false,
    };
  }

  private find(name: string): string {
    for (const directory of this._directories) {
      const fullPath = path.join(directory, name);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    throw new Error(`Template not found: ${name}`);
  }
}
