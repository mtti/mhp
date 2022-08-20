import { RenderMarkdownFunc } from '../utils/renderMarkdown';
import { BuildContext } from './BuildContext';
import { Page } from './Page';
import { RenderStringFunc } from './RenderStringFunc';
import { TemplateSource } from './TemplateSource';

export type LoadPageFunc = (
  name: string,
) => Promise<Page>;

export type RenderFunc = (
  context: BuildContext,
  vars: Record<string, unknown>,
  template: TemplateSource,
) => string;

export type WriteOptions = {
  contentType?: string;
};

export type WriteFunc = (
  uri: readonly string[],
  content: string,
  options?: WriteOptions,
) => Promise<void>;

export type Environment = {
  readonly renderString: RenderStringFunc;
  readonly render: RenderFunc;
  readonly renderMarkdown: RenderMarkdownFunc;
  readonly write: WriteFunc;
  readonly loadPage: LoadPageFunc;
  readonly globals: Record<string, unknown>;
};
