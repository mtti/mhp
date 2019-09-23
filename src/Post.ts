import fs from 'fs-extra';
import fm from 'front-matter';
import { FileInfo } from './types';

export class Post {
  /**
   * Load a post from a Markdown file.
   *
   * @param file
   */
  static async load(file: FileInfo): Promise<Post> {
    const source = await fs.readFile(file.path, 'utf8');
    const data = fm(source);
    return new Post(data.attributes as Record<string, unknown>, data.body);
  }

  private _attributes: Record<string, unknown>;

  private _body: string;

  constructor(attributes: Record<string, unknown>, body: string) {
    this._attributes = attributes;
    this._body = body;
  }

  async getBody(): Promise<string> {
    return this._body;
  }
}
