import fs from 'fs-extra';
import fm from 'front-matter';
import slugify from 'slugify';
import { FileInfo } from './types/FileInfo';

export class Post {
  /**
   * Load a post from a Markdown file.
   *
   * @param file
   */
  static async load(file: FileInfo): Promise<Post> {
    const source = await fs.readFile(file.path, 'utf8');
    const data = fm(source);
    return new Post(
      file,
      data.attributes as Record<string, unknown>,
      data.body,
    );
  }

  private _source: FileInfo;

  private _attributes: Record<string, unknown>;

  private _body: string;

  get attributes(): Record<string, unknown> {
    return this._attributes;
  }

  constructor(
    source: FileInfo,
    attributes: Record<string, unknown>,
    body: string,
  ) {
    this._source = source;
    this._attributes = attributes;
    this._body = body;

    if (!this._attributes.slug) {
      this._attributes.slug = slugify(this._source.name);
    }
  }

  async getBody(): Promise<string> {
    return this._body;
  }
}
