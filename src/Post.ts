import fs from 'fs-extra';
import fm from 'front-matter';
import { DateTime } from 'luxon';
import marked from 'marked';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import { FileInfo } from './types/FileInfo';
import { expectDateTime } from './utils/expectDateTime';
import { expectUuidString } from './utils/expectUuidString';

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

  private _uri: readonly string[]|null = null;

  private _uuid: string;

  private _publishedAt: DateTime;

  private _updatedAt: DateTime;

  get attributes(): Record<string, unknown> {
    return this._attributes;
  }

  get uri(): readonly string[] {
    if (!this._uri) {
      throw new Error('Tried to get canonical URI for a post that doesn\'t have one');
    }
    return [...this._uri];
  }

  set uri(value: readonly string[]) {
    if (this._uri) {
      throw new Error(`Post at ${this._uri.join('/')} already has a canonical URI, tried to set ${value.join('/')}`);
    }
    this._uri = [...value];
  }

  get uuid(): string {
    return this._uuid;
  }

  get publishedAt(): DateTime {
    return this._publishedAt;
  }

  get updatedAt(): DateTime {
    return this._updatedAt;
  }

  get safeHtml(): nunjucks.runtime.SafeString {
    return new nunjucks.runtime.SafeString(marked(this._body));
  }

  constructor(
    source: FileInfo,
    attributes: Record<string, unknown>,
    body: string,
  ) {
    this._source = source;
    this._attributes = attributes;
    this._body = body;

    this._uuid = expectUuidString(this._attributes.uuid);
    this._publishedAt = expectDateTime(this._attributes.publishedAt);
    this._updatedAt = this._attributes.updatedAt ?
      expectDateTime(this._attributes.updatedAt) : this._publishedAt;

    if (!this._attributes.slug) {
      this._attributes.slug = slugify(this._source.name);
    }
  }

  async getBody(): Promise<string> {
    return this._body;
  }

  async getHtml(): Promise<string> {
    return marked(await this.getBody());
  }
}
