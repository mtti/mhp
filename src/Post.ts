import cheerio from 'cheerio';
import { DateTime } from 'luxon';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import { RenderStringFunc } from './types/RenderStringFunc';
import { FileInfo } from './types/FileInfo';
import { expectDateTime } from './utils/expectDateTime';
import { expectUuidString } from './utils/expectUuidString';
import { FrontMatterDocument, readFrontMatter } from './utils/readFrontMatter';
import { RenderMarkdownFunc } from './utils/renderMarkdown';

export class Post {
  static async load(
    renderMarkdown: RenderMarkdownFunc,
    renderString: RenderStringFunc,
    file: FileInfo,
  ): Promise<Post> {
    let frontMatter: FrontMatterDocument;

    if (file.extension === '.md') {
      frontMatter = await Post.loadMarkdown(file);
    } else if (file.extension === '.html') {
      frontMatter = await Post.loadHtml(file);
    } else {
      throw new Error(`Unsupported post file extension: ${file.extension}`);
    }

    return new Post(
      renderMarkdown,
      renderString,
      file,
      frontMatter.attributes,
      frontMatter.body,
    );
  }

  /**
   * Load a post from a HTML file.
   *
   * @param file
   * @returns The loaded post
   */
  static loadHtml(file: FileInfo): Promise<FrontMatterDocument> {
    return readFrontMatter(file.path, '<!--', '-->');
  }

  /**
   * Load a post from a Markdown file.
   *
   * @param file
   */
  static loadMarkdown(file: FileInfo): Promise<FrontMatterDocument> {
    return readFrontMatter(file.path, '---', '---');
  }

  private _source: FileInfo;

  private _attributes: Record<string, unknown>;

  private _body: string;

  private _uri: readonly string[]|null = null;

  private _uuid: string;

  private _publishedAt: DateTime;

  private _updatedAt: DateTime;

  private _renderMarkdown: RenderMarkdownFunc;

  private _renderString: RenderStringFunc;

  get attributes(): Record<string, unknown> {
    return this._attributes;
  }

  get uri(): readonly string[] {
    if (!this._uri) {
      throw new Error(`Tried to get canonical URI for post '${this._attributes.slug}' (${this.uuid}) that doesn't have one`);
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

  get html(): string {
    return this.render();
  }

  get safeHtml(): nunjucks.runtime.SafeString {
    return new nunjucks.runtime.SafeString(this.html);
  }

  get summary(): nunjucks.runtime.SafeString {
    const summaryAttr = this._attributes.summary;
    if (typeof summaryAttr === 'string') {
      return new nunjucks.runtime.SafeString(summaryAttr);
    }

    const doc = cheerio.load(this.html);
    const firstParagraph = doc('p').first().html();
    return new nunjucks.runtime.SafeString(firstParagraph || '');
  }

  constructor(
    renderMarkdown: RenderMarkdownFunc,
    renderString: RenderStringFunc,
    source: FileInfo,
    attributes: Record<string, unknown>,
    body: string,
  ) {
    this._renderMarkdown = renderMarkdown;
    this._renderString = renderString;
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

  render(): string {
    if (this._source.extension === '.md') {
      return this._renderMarkdown(this._body);
    }
    if (this._source.extension === '.html') {
      return this._renderString(this._body, this._attributes);
    }

    return '';
  }

  set(values: Record<string, unknown>): void {
    this._attributes = {
      ...this._attributes,
      ...values,
    };
  }
}
